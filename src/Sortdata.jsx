/*
//////
//
Trying to find all the cases and sort data correctly
//
//////
*/

export default function sortData(data) {
  // Saving data into new variable, leaving me with clean data to work with
  const changed = data.map((value) => value);

  const ORDINARY_PRODUCT_OFFER = changed[0];

  // Edge case: No need to sort data with one or less elements.
  if (changed.length <= 1) {
    changed[0].ValidUntil = '';
    return changed;
  }

  // Set pure nulls
  changed.forEach((element, index) => {
    if (element.ValidFrom === 'NULL') {
      changed[index].ValidFrom = null;
    }
    if (element.ValidUntil === 'NULL') {
      changed[index].ValidUntil = null;
    }
  });

  let index = 0;

  for (let element of changed) {
    const productOfferA = {};
    Object.assign(productOfferA, element);
    const indexB = index + 1;

    // Grab productOfferB if not out of bounds..
    const productOfferB = indexB < changed.length ? changed[indexB] : null;

    if (productOfferB === null) {
      // Edge Case: Missing price for todays date..

      // Insert ordinary price X into LAST index.
      // X.start = dateA.end, X.end = "", X.Price = elemOne.Price
      const addOrdinaryOffer = {};
      Object.assign(addOrdinaryOffer, ORDINARY_PRODUCT_OFFER);
      addOrdinaryOffer.ValidFrom = productOfferA.ValidUntil;
      addOrdinaryOffer.ValidUntil = '';

      changed.push(addOrdinaryOffer);
      break;
    }

    const dateAStart = new Date(productOfferA.ValidFrom);
    const dateAEnd = new Date(productOfferA.ValidUntil);

    const dateBStart = new Date(productOfferB.ValidFrom);
    const dateBEnd = new Date(productOfferB.ValidUntil);

    // Case 1: Dates can't overlap...
    if (dateAEnd > dateBStart) {
      productOfferA.ValidUntil = productOfferB.ValidFrom;

      changed[index] = productOfferA;
    } else if (productOfferA.ValidUntil === null) {
      // Case 2: Missing end date...
      productOfferA.ValidUntil = productOfferB.ValidFrom;
      changed[index] = productOfferA;
    } else if (dateAEnd < dateBStart) {
      // Case 3: Missing ordinary price between dates...

      // Insert ordinary price X into current index.
      // [ dateA, X, dateB ]
      // X.start = dateA.end, X.end = dateB.start, X.Price = elemOne.Price

      const addOrdinaryOffer = {};
      Object.assign(addOrdinaryOffer, ORDINARY_PRODUCT_OFFER);
      addOrdinaryOffer.ValidFrom = productOfferA.ValidUntil;
      addOrdinaryOffer.ValidUntil = productOfferB.ValidFrom;

      changed.splice(indexB, 0, addOrdinaryOffer);
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

  const lastInArray = changed[changed.length - 1];
  let dateOfHighest = '';

  data.forEach((element) => {
    if (new Date(element.ValidUntil).getTime() === max.getTime()) {
      dateOfHighest = element.ValidUntil;
    }
  });

  if (max > new Date(lastInArray.ValidFrom)) {
    changed[changed.length - 1].ValidUntil = dateOfHighest;
  }

  const compareDate = new Date(changed[changed.length - 1].ValidUntil);
  // ONE LAST
  if (compareDate.getTime() === max.getTime()) {
    const addOrdinaryOffer = {};
    Object.assign(addOrdinaryOffer, ORDINARY_PRODUCT_OFFER);
    addOrdinaryOffer.ValidFrom = dateOfHighest;
    addOrdinaryOffer.ValidUntil = '';

    changed.push(addOrdinaryOffer);
  }

  /*
  //
   CHECKING PRICES
  //
  */

  // New array for comaparing
  const newArray = [];
  data.forEach(({ ValidFrom, ValidUntil, UnitPrice }) =>
    newArray.push({ ValidFrom, ValidUntil, UnitPrice })
  );

  //setting NULL to date to make easier to compare

  newArray.forEach((element) => {
    if (element.ValidUntil === null) {
      element.ValidUntil = '2999-12-31 00:00:00.0000000';
    }
  });

  /*

  CHANGED = OPTIMIZED TABEL
  NEW ARRAY = FETCH DATA TABELL

  Loopa igenom changed och jämföra med NEW ARRAY om det finns ett billigare pris
  */
  let indexOfChanged = 1;
  changed.forEach(({ ValidFrom, ValidUntil }) => {
    newArray.forEach((e) => {
      if (
        new Date(e.ValidFrom) <= new Date(ValidFrom) &&
        new Date(e.ValidUntil) >= new Date(ValidFrom) &&
        new Date(e.ValidFrom) <= new Date(ValidUntil) &&
        new Date(e.ValidUntil) >= new Date(ValidUntil)
      ) {
        if (e.UnitPrice <= changed[indexOfChanged - 1].UnitPrice) {
          changed[indexOfChanged - 1].UnitPrice = e.UnitPrice;
        }
      }
    });
    indexOfChanged++;
  });

  return changed;
}
