Feature: Discover resources by author
  Scenario: Browse the published author catalog and resources offline
    Given I open my template wiki
    When I browse authors from the library
    Then author pages contain exactly their published resources
    When I take the template offline
    Then the author catalog remains available offline

  Scenario: Unknown authors do not show another author's resources
    Given a reader using "en-dark-mobile"
    When I open an unknown author
    Then I see a not found response
