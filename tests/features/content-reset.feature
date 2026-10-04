@content-reset
Feature: Empty starter content safely
  Scenario: Preview and reset content explicitly
    Given an isolated starter with public and private content
    Then resetting without confirmation preserves all files
    And resetting public content preserves private notes and raw sources
    And explicitly resetting private content empties the remaining collection

  Scenario: Refuse linked content directories
    Given an isolated starter with public and private content
    Then reset refuses a symbolic link before deleting any content
