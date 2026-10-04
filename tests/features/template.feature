Feature: A reusable wiki template
  Scenario: Read and search the current content
    Given I open my template wiki
    Then the library reflects my Markdown files
    And I can find and read an available note

  Scenario: Read the template offline
    Given I open my template wiki
    When I take the template offline
    Then the template and graph work without a network

  Scenario: Keep appearance and language preferences
    Given I open my template wiki
    When I change the template appearance and language
    Then the template remembers my choices after reload

  Scenario: Operate search with the keyboard
    Given I open my template wiki
    When I open and close template search with the keyboard
    Then focus returns to the template search button
