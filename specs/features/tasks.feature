@web @e2e
Feature: Mark Tasks Web & API Management
  As a Mark Tasks user
  I want to create, validate, complete, and remove tasks through the web interface
  So that my task list stays accurate across desktop and mobile viewports

  @smoke
  Scenario: Web application loads with expected page title
    When I navigate to "/"
    Then the browser page title should be "Gerencie suas tarefas com Mark L"

  @positive @create
  Scenario: Create a new task through the UI
    Given the task "Ler um livro de Typescript" does not exist in the backend
    When I navigate to "/"
    And I submit the task "Ler um livro de Typescript"
    Then the task "Ler um livro de Typescript" should be visible in the task list

  @negative @duplicate
  Scenario: Reject duplicate task creation
    Given the task "Comprar Ketchup" already exists via API ("POST /tasks")
    When I navigate to "/"
    And I submit the task "Comprar Ketchup"
    Then the alert modal ".swal2-html-container" should display "Task already exists!"

  @negative @validation
  Scenario: Enforce mandatory task name via HTML5 validation
    When I navigate to "/"
    And I submit an empty task name
    Then the input native validationMessage should equal "This is a required field"

  @positive @update
  Scenario: Mark an existing task as completed
    Given the task "Pagar a fatura do cartão de crédito" exists via API with "is_done: false"
    When I navigate to "/"
    And I click the toggle button for "Pagar a fatura do cartão de crédito"
    Then the task text should have CSS "text-decoration-line" equal to "line-through"

  @positive @delete
  Scenario: Delete an existing task from the list
    Given the task "Estudar Ruby" exists via API with "is_done: false"
    When I navigate to "/"
    And I click the delete button for "Estudar Ruby"
    Then the task "Estudar Ruby" should no longer be visible in the task list
