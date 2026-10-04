Feature: Audit guards detect real regressions
  Scenario: Detect an inaccessible control
    Then the accessibility auditor rejects a button without a name

  Scenario: Detect a real server and client mismatch
    Then the hydration observer detects deliberately changed server HTML

  Scenario: Detect detailed warnings as well as production errors
    Then the hydration observer captures warning and error messages
