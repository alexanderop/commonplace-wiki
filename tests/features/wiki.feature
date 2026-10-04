@demo
Feature: A connected offline knowledge library
  Scenario: Read a note and follow its connections
    Given I open the knowledge library
    When I open the note "Wissen, das bleibt"
    Then I see the article "Wissen, das bleibt"
    And I see the insight "Vom Sammeln zum Verstehen"
    When I follow the article link "Vernetzte Notizen"
    Then I see the article "Vernetzte Notizen"
    And I see backlinks to this note
    And I can copy the page link
    When I search for "Vernetzte Notizen"
    And I select the search result "Vernetzte Notizen"
    Then I see the article "Vernetzte Notizen"

  Scenario: Find a thought in the full text
    Given I open the knowledge library
    When I search for "Wiederentdeckung"
    Then I find the note "Wissen, das bleibt"
    When I search for "unfindable-zqxv"
    Then I see an empty search result

  Scenario: Explore the graph
    Given I open the knowledge graph
    Then I see the interactive graph
    When I filter the graph to "Themen"
    Then the graph list contains only topics
    When I open a note from the graph list
    Then I see an article

  Scenario: Read and search offline
    Given I open the knowledge library
    And the complete wiki is available offline
    When I disconnect from the network and reload
    Then I see the knowledge library
    When I open the note "Markdown als Gedächtnis"
    Then I see the article "Markdown als Gedächtnis"
    When I search for "Wiederentdeckung"
    Then I find the note "Wissen, das bleibt"

    When I select the search result "Wissen, das bleibt"
    Then I see the article "Wissen, das bleibt"
    When I open the graph from navigation
    Then I see the interactive graph

  Scenario: Navigate on a small screen
    Given I open the knowledge library
    When I use a small screen
    Then the library fits the screen
    When I search for "Wiederentdeckung"
    Then I find the note "Wissen, das bleibt"

  Scenario: Open an unknown note
    Given I open an unknown note
    Then I see a not found response

  Scenario: Prefer dark mode and remember an explicit choice
    Given I open the knowledge library
    Then the dark design is active
    When I activate the light design
    And I reload the page
    Then the light design is active
    When I activate the dark design
    And I reload the page
    Then the dark design is active

  Scenario: Change the interface language without translating notes
    Given I open the knowledge library
    When I choose English
    Then the interface is English
    When I open the note "Dependency Injection"
    Then the article interface is English and the note stays German
    When I reload the page
    Then the article interface is English and the note stays German
    When I choose German
    Then the article interface is German

  Scenario: Browse sources by resource type
    Given I open the knowledge library
    When I filter resources to "Dokumentation"
    Then I see three documentation resources
    When I open the note "Comark: Komponenten im Text"
    Then the article identifies a documentation resource
    Given I open the knowledge library
    When I filter resources to "YouTube-Video"
    Then I see an empty resource category
    When I show all resources
    Then I see four source resources
    When I filter the library to topics
    Then I see six topics without resource filters

  Scenario: Use the shared search dialog with the keyboard
    Given I open the knowledge library
    When I open the search dialog using the keyboard
    Then focus stays inside the search dialog
    When I dismiss the search dialog with Escape
    Then focus returns to the search trigger
