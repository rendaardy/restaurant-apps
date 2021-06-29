Feature('favorite restaurant');

Scenario('liking a restaurant', ({ I }) => {
  I.amOnPage('/');
  I.see('Megabucket');
  I.seeElement('.article-list__content > mb-card');

  let firstRestaurantTitle: string = '';
  I.usePlaywrightTo('pierce through the Shadow DOM :)', async ({ page }: any) => {
    firstRestaurantTitle = await page.textContent(
      'mb-card:first-child .card__content:has(h3.card__title)'
    );
    await page.click('mb-card:first-child .card__action:has(a.btn)');
  });

  I.see(firstRestaurantTitle);
  I.seeElement('mb-like-button[aria-label="Like this restaurant"]');
  I.dontSeeElement('mb-like-button[aria-label="Dislike this restaurant"]');

  I.click('//mb-like-button');
  I.seeElement('mb-like-button[aria-label="Dislike this restaurant"]');
  I.dontSeeElement('mb-like-button[aria-label="Like this restaurant"]');

  I.amOnPage('/favorite');
  I.seeElement('.article-list__content > mb-card');
});
