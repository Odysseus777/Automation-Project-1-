beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})
/*
BONUS TASK: add visual tests for registration form 3
* Create tests to verify visual parts of the page:
     * dropdown and dependencies between 2 dropdowns:
        * list of cities changes depending on the choice of country
        * if city is already chosen and country is updated, then city choice should be removed
    * checkboxes, their content and links
    * email format
 */
//Create test suite for visual tests for registration form 3 (describe block)
describe('Visual test suite for registration form 3, Mirando Kersman', () => {
    it('1. Verify radio buttons and their content', () => {
        cy.get('input[type="radio"]').should('have.length', 4)
        cy.get('input[type="radio"]').next().eq(0).should('have.text', 'Daily')
        cy.get('input[type="radio"]').next().eq(1).should('have.text', 'Weekly')
        cy.get('input[type="radio"]').next().eq(2).should('have.text', 'Monthly')
        cy.get('input[type="radio"]').next().eq(3).should('have.text', 'Never')
    })
    it('2. Verify dropdowns and dependencies between country and city', () => {
        cy.get('#country').select('Spain')
        cy.get('#city').children().should('contain', 'Malaga')
            .and('contain', 'Madrid')
            .and('contain', 'Valencia')
            .and('contain', 'Corralejo')
        cy.get('#country').select('Estonia')
        cy.get('#city').children().should('contain', 'Tallinn')
            .and('contain', 'Haapsalu')
            .and('contain', 'Tartu')
        cy.get('#country').select('Austria')
        cy.get('#city').children().should('contain', 'Vienna')
            .and('contain', 'Salzburg')
            .and('contain', 'Innsbruck')
        cy.get('[label="Vienna"]').click() //needs clarification, it does not become active after clicking
        //if city is already chosen and country is updated, then city choice is removed
        cy.get('#country').select('Estonia')
        cy.get('#city').should('not.have.value', 'Vienna') // City choice should be removed - needs clarification
    })
    it('3. Verify checkboxes, their content, and links', () => {
        cy.get('input[type="checkbox"]').should('have.length', 2)
        //cy.contains('Accept our privacy policy')
        cy.get('input[type="checkbox"]').eq(1).next().should('have.text', 'Accept our cookie policy')
        cy.get('button [href="cookiePolicy.html"]').click()
        cy.url().should('contain', '/cookiePolicy.html')
        cy.go('back')
        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(0).uncheck().should('not.be.checked')
        cy.get('input[type="checkbox"]').eq(1).uncheck().should('not.be.checked')
    })
    it('4. Verify email format validation', () => {
        cy.get('input[name="email"]').type('invalid-email')
        cy.get('#emailAlert').should('be.visible').contains('Invalid email address')
        cy.get('input[type="submit"]').should('not.be.enabled')
    })

})
describe('Functional test suite for registration form 3, Mirando Kersman', () => {
    // all fields are filled in + corresponding assertions
    it('1. User can submit form by filling all fields', () => {
        cy.get('#name').type('John Doe')
        cy.get('input[name="email"]').type('john.doe@example.com')
        cy.get('#country').select('Spain')
        cy.get('#city').select('Madrid')
        cy.get('input[type="date"]').first().type('2024-07-16')
        cy.get('input[type="radio"][value="Weekly"]').check().should('be.checked')
        cy.get('#birthday').type('1985-07-30')
        cy.get('input[type="checkbox"]').first().check().should('be.checked')
        cy.get('input[type="checkbox"]').last().check().should('be.checked')
        cy.get('input[type="submit"]').should('be.enabled').click()
        cy.get('h1').should('have.text', 'Submission received')
    })
    //only mandatory fields are filled in + corresponding assertions
    it('2. User can submit form by filling only mandatory fields', () => {
        cy.get('#name').type('John Doe');
        cy.get('input[name="email"]').type('john.doe@example.com')
        cy.get('#country').select('Spain')
        cy.get('#city').select('Madrid')
        cy.get('#birthday').type('1985-07-30') //should be mandatory, but it is not
        cy.get('input[type="checkbox"]').first().check().should('be.checked')
        cy.get('input[type="submit"]').should('be.enabled').click()
        cy.get('h1').should('have.text', 'Submission received')
    })

    // mandatory fields are absent + corresponding assertions(try using function)
    it('3. Verify the form could not be submitted when email is absent', () => {
        fillMandatoryFields()
        cy.get('input[name="email"]').clear()
        cy.get('input[type="checkbox"]').first().check().should('be.checked')
        cy.get('input[type="submit"]').should('not.be.enabled')
        cy.get('#emailAlert').should('be.visible').contains('Email is required')
            .and('have.css', 'color', 'rgb(255, 0, 0)')

    })

    //add file functionality(google yourself for solution!)
    it('4. Test file upload functionality', () => {
        fillMandatoryFields()
        cy.get('#myFile').attachFile('cerebrum_hub_logo.png')
        cy.get('input[type="checkbox"]').first().check().should('be.checked')
        cy.get('input[type="submit"]').should('be.enabled').click()
        cy.get('h1').should('have.text', 'Submission received')
    })
})

function fillMandatoryFields() {
    cy.log('Filling the mandatory fields with function')
    cy.get('#name').type('Mirando')
    cy.get('input[name="email"]').type('email@email.com')
    cy.get('#country').select('Estonia')
    cy.get('#city').select('Tallinn')
    cy.get('#birthday').type('1985-07-30')
}