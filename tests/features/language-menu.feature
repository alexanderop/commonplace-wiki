Feature: Styled accessible language selection
  Scenario Outline: Choose a language with the keyboard
    Given a reader using "<profile>"
    When the reader opens the published page "./"
    Then the language menu supports keyboard selection and dismissal
    Examples:
      | profile          |
      | en-dark-desktop  |
      | en-light-mobile  |
