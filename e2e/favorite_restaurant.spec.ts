Feature('favorite restaurant');

Scenario('liking a restaurant', ({ I }) => {
  I.amOnPage('https://github.com');
  I.see('Why GitHub?');
  I.see('Pricing');
});
