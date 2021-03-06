export default function sortData(data) {
  // Saving data into new variable, leaving me with clean data to work with
  const products = [...data];

  // Edge case: No need to sort data with one or less elements.
  if (products.length <= 1) {
    products[0].ValidUntil = '';
    return products;
  }

  // Sorting data by ascending number of PriceValueId
  products.sort(function (a, b) {
    return parseFloat(a.PriceValueId) - parseFloat(b.PriceValueId);
  });

  // Sorting data
  function sortingData() {
    addingCorrectFields();
    correctEgdeCaseFields();
    checkCorrectPrice();
    deleteDoublets();
  }
  /*
  //
  Adding correct fields
  //
  */

  function addingCorrectFields() {
    const ORDINARY_PRODUCT_OFFER = products[0];
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
        addOrdinaryOffer.ValidUntil = '9999-12-31 23:59:59.0000000';

        products.push(addOrdinaryOffer);
        break;
      }

      const dateAEnd = new Date(productOfferA.ValidUntil);

      const dateBStart = new Date(productOfferB.ValidFrom);

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
  }

  /*
//
///
// ADDING edge case fields
//
///
*/
  function correctEgdeCaseFields() {
    const ORDINARY_PRODUCT_OFFER = products[0];
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
      addOrdinaryOffer.ValidUntil = '9999-12-31 23:59:59.0000000';

      products.push(addOrdinaryOffer);
    }
  }

  /*
  //
  //
   CHECKING PRICES
  //
  ///
  */

  function checkCorrectPrice() {
    //New array for comaparing
    const correctPrices = [];
    data.forEach(({ ValidFrom, ValidUntil, UnitPrice }) =>
      correctPrices.push({ ValidFrom, ValidUntil, UnitPrice })
    );

    //setting NULL to date to compare

    correctPrices.forEach((e) => {
      if (e.ValidUntil === null) {
        e.ValidUntil = '9999-12-31 00:00:00.0000000';
      }
    });

    /*
Checking ever price 
  */
    let indexOfChanged = 1;
    products.forEach(({ ValidFrom, ValidUntil }) => {
      // Taking the cheapest price
      correctPrices.forEach((e) => {
        if (
          new Date(e.ValidFrom) <= new Date(ValidFrom) &&
          new Date(e.ValidUntil) >= new Date(ValidUntil)
        ) {
          // if prices is cheaper asign it
          if (e.UnitPrice <= products[indexOfChanged - 1].UnitPrice) {
            products[indexOfChanged - 1].UnitPrice = e.UnitPrice;
          }
        }
      });
      indexOfChanged++;
    });
  }

  /*
//
//
Deleting doublets
//
//
  */

  function deleteDoublets() {
    // Premise: All data is sorted in correct ascending date intervals

    for (let index = 0; index < products.length; index++) {
      if (index > 0) {
        const elem = products[index];
        const prevIndex = index - 1;
        const prevElem = products[prevIndex];

        if (elem.UnitPrice === prevElem.UnitPrice) {
          // Adjust dates on current elem:
          elem.ValidFrom = prevElem.ValidFrom;

          // Remove previous element
          products.splice(prevIndex, 1);

          // Go back 1 in index:
          index--;
        }
      }
    }
  }
  sortingData();
  return products;
}
