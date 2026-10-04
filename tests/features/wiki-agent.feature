@wiki-agent
Feature: Wiki agent source and publication helpers
  Scenario: Recognize the same video across URL formats
    Given an isolated wiki with an existing private video source
    Then alternate video URLs identify the existing source without modifying it

  Scenario: A missing transcript remains pending
    Given an isolated wiki with an existing private video source
    Then a source without evidence is pending and an empty transcript is not evidence

  Scenario: Available evidence still requires inspection
    Given an isolated wiki with an existing private video source
    Then supplied evidence is available without claiming it has been verified

  Scenario: Keep meaningful article URL parameters
    Given an isolated wiki with an existing private video source
    Then tracking parameters are ignored but distinct article identifiers are preserved

  Scenario: Reject public references to private knowledge
    Given an isolated wiki with an existing private video source
    Then a public note referencing that private source fails public compilation
