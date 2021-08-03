const assert = require('assert');

Feature('favorite restaurant');

Before(({ I }) => {
  I.amOnPage('/');
});

Scenario('adding 3 restaurants to favorite list and remove one of them', async ({ I }) => {
  for (let i = 1; i <= 3; i++) {
    I.usePlaywrightTo('click button on the card', async ({ page }: any) => {
      await page.click(`mb-card:nth-child(${i}) .card__action:has(a.btn)`);
    });
    I.wait(2);
    I.click('//mb-like-button');
    I.amOnPage('/');
  }

  I.amOnPage('/favorite');
  let favoriteMovies = await I.grabNumberOfVisibleElements('mb-card');
  assert.strictEqual(3, favoriteMovies);

  I.usePlaywrightTo('click button on the card', async ({ page }: any) => {
    await page.click('mb-card:first-child .card__action:has(a.btn)');
  });

  I.click('//mb-like-button');

  I.amOnPage('/favorite');
  favoriteMovies = await I.grabNumberOfVisibleElements('mb-card');
  assert.strictEqual(2, favoriteMovies);
});

Scenario('show list of restaurants in homepage', ({ I }) => {
  I.see('Megabucket');
  I.seeElement('.article-list__content > mb-card');
});

Scenario('search restaurants by name which contains "Fairy Cafe"', ({ I }) => {
  I.seeElement('input[name="q"]');
  I.fillField('q', 'Fairy Cafe');
  I.click('Search');

  let firstFoundRestaurantTitle = '';

  I.usePlaywrightTo('click button on the card', async ({ page }: any) => {
    firstFoundRestaurantTitle = await page.textContent(
      'mb-card:first-child .card__content h3.card__title'
    );

    assert.strictEqual('Fairy Cafe', firstFoundRestaurantTitle);
  });
});

Scenario('send a review', async ({ I }) => {
  I.usePlaywrightTo('click button on the card', async ({ page }: any) => {
    await page.click('mb-card:first-child .card__action:has(a.btn)');
  });

  within('.customer-reviews__form', () => {
    I.fillField('name', 'Jane');
    I.fillField('review', 'Awesome');
    I.click('Send');
  });

  I.wait(3);

  I.seeElement('.customer-reviews__list');

  const name = (await I.grabTextFrom('.customer-reviews__list li:last-child p:first-child')).split(
    '-'
  )[0];
  const review = await I.grabTextFrom('.customer-reviews__list li:last-child p:last-child');

  assert.strictEqual('Jane', name.trim());
  assert.strictEqual('Awesome', review.trim());
});
