Feature: Mobile reading and finding
  Scenario Outline: Find notes directly on a narrow screen
    Given a reader using "en-dark-mobile"
    And a screen width of <width> pixels
    When the reader opens the published page "./"
    Then search is directly available without opening navigation
    And the home preview graph is not mounted
    And mobile actions have comfortable touch targets
    When I open mobile navigation with the keyboard
    Then navigation keeps focus inside until Escape returns it
    Examples:
      | width |
      | 320   |
      | 390   |

  Scenario: Navigation adapts to a wider screen
    Given a reader using "en-dark-mobile"
    When the reader opens the published page "./"
    And I open mobile navigation with the keyboard
    And the screen becomes desktop width
    Then desktop navigation is usable without a modal

  Scenario Outline: Notes stay within narrow reading widths
    Given a reader using "en-dark-mobile"
    And a screen width of <width> pixels
    When I read the available notes on a narrow screen
    Then every note fits without horizontal page scrolling
    Examples:
      | width |
      | 320   |
      | 390   |
