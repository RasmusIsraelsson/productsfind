/*
//////
//
Trying to find all the cases and sort data correctly
//
//////
*/

export default function sortData(data) {
  // Saving data into new variable, leaving me with clean data to work with
  const products = data.map((value) => value);

  products.sort(function (a, b) {
    return parseFloat(a.PriceValueId) - parseFloat(b.PriceValueId);
  });

  const ORDINARY_PRODUCT_OFFER = products[0];

  // Edge case: No need to sort data with one or less elements.
  if (products.length <= 1) {
    products[0].ValidUntil = '';
    return products;
  }

  // Set pure nulls
  products.forEach((element, index) => {
    if (element.ValidFrom === 'NULL') {
      products[index].ValidFrom = null;
    }
    if (element.ValidUntil === 'NULL') {
      products[index].ValidUntil = null;
    }
  });

  let index = 0;

  for (let element of products) {
    const productOfferA = {};
    Object.assign(productOfferA, element);
    const indexB = index + 1;

    // Grab productOfferB if not out of bounds..
    const productOfferB = indexB < products.length ? products[indexB] : null;

    if (productOfferB === null) {
      // Edge Case: Missing price for todays date..

      // Insert ordinary price X into LAST index.
      // X.start = dateA.end, X.end = "", X.Price = elemOne.Price
      const addOrdinaryOffer = {};
      Object.assign(addOrdinaryOffer, ORDINARY_PRODUCT_OFFER);
      addOrdinaryOffer.ValidFrom = productOfferA.ValidUntil;
      addOrdinaryOffer.ValidUntil = '';

      products.push(addOrdinaryOffer);
      break;
    }

    const dateAStart = new Date(productOfferA.ValidFrom);
    const dateAEnd = new Date(productOfferA.ValidUntil);

    const dateBStart = new Date(productOfferB.ValidFrom);
    const dateBEnd = new Date(productOfferB.ValidUntil);

    // Case 1: Dates can't overlap...
    if (dateAEnd > dateBStart) {
      productOfferA.ValidUntil = productOfferB.ValidFrom;

      products[index] = productOfferA;
    } else if (productOfferA.ValidUntil === null) {
      // Case 2: Missing end date...
      productOfferA.ValidUntil = productOfferB.ValidFrom;
      products[index] = productOfferA;
    } else if (dateAEnd < dateBStart) {
      // Case 3: Missing ordinary price between dates...

      // Insert ordinary price X into current index.
      // [ dateA, X, dateB ]
      // X.start = dateA.end, X.end = dateB.start, X.Price = elemOne.Price

      const addOrdinaryOffer = {};
      Object.assign(addOrdinaryOffer, ORDINARY_PRODUCT_OFFER);
      addOrdinaryOffer.ValidFrom = productOfferA.ValidUntil;
      addOrdinaryOffer.ValidUntil = productOfferB.ValidFrom;

      products.splice(indexB, 0, addOrdinaryOffer);
    }

    index++;
  }

  // ADDING CORRECT AMOUNT OF FIELDS
  const lastDate = [];
  data.forEach((product) => {
    if (product.ValidUntil === '') {
      return lastDate;
    }

    lastDate.push(new Date(product.ValidUntil));
  });

  var max = lastDate.reduce(function (a, b) {
    return a > b ? a : b;
  });

  const lastInArray = products[products.length - 1];
  let dateOfHighest = '';

  data.forEach((element) => {
    if (new Date(element.ValidUntil).getTime() === max.getTime()) {
      dateOfHighest = element.ValidUntil;
    }
  });

  if (max > new Date(lastInArray.ValidFrom)) {
    products[products.length - 1].ValidUntil = dateOfHighest;
  }

  const compareDate = new Date(products[products.length - 1].ValidUntil);
  // ONE LAST
  if (compareDate.getTime() === max.getTime()) {
    const addOrdinaryOffer = {};
    Object.assign(addOrdinaryOffer, ORDINARY_PRODUCT_OFFER);
    addOrdinaryOffer.ValidFrom = dateOfHighest;
    addOrdinaryOffer.ValidUntil = '';

    products.push(addOrdinaryOffer);
  }

  /*
  //
   CHECKING PRICES
  //
  */

  // New array for comaparing
  const correctPrices = [];
  data.forEach(({ ValidFrom, ValidUntil, UnitPrice }) =>
    correctPrices.push({ ValidFrom, ValidUntil, UnitPrice })
  );

  //setting NULL to date to make easier to compare

  correctPrices.forEach((element) => {
    if (element.ValidUntil === null) {
      element.ValidUntil = '2999-12-31 00:00:00.0000000';
    }
  });

  /*

  */
  let indexOfChanged = 1;
  products.forEach(({ ValidFrom, ValidUntil }) => {
    correctPrices.forEach((e) => {
      if (
        new Date(e.ValidFrom) <= new Date(ValidFrom) &&
        new Date(e.ValidUntil) >= new Date(ValidFrom) &&
        new Date(e.ValidFrom) <= new Date(ValidUntil) &&
        new Date(e.ValidUntil) >= new Date(ValidUntil)
      ) {
        if (e.UnitPrice <= products[indexOfChanged - 1].UnitPrice) {
          products[indexOfChanged - 1].UnitPrice = e.UnitPrice;
        }
      }
    });
    indexOfChanged++;
  });

  return products;
}
