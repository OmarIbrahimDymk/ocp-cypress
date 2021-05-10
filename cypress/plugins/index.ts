/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

import faker from "faker";

import { IShareholder } from "../support/lib/shareholder";

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on("task", {
    randomShareholders(amount) {
      const shareholders: IShareholder[] = [];
      for (let index = 0; index < amount; index++) {
        shareholders.push({
          row: index,
          identityNumber: `0${faker.random.number(3)}${faker.random.number({
            min: 100000,
            max: 999999,
          })}`,
          fullName: faker.fake("{{name.firstName}} {{name.lastName}}"),
          capital: +faker.finance.amount(),
          isDirector: faker.random.boolean(),
          sharePercentage: +(100 / amount).toFixed(2),
        });
      }
      return shareholders;
    },
  });
};
