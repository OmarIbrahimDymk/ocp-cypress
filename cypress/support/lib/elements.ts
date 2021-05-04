export const tableInput = {
  addBtn(name: string = "Collection") {
    return `tableInputAddBtn-${name}`;
  },
  deleteBtn(name: string = "Collection") {
    return `tableInputDeleteBtn-${name}`;
  },
  inputField(fieldName: string, collectionName: string = "Collection") {
    return `tableInputField-${fieldName}-${collectionName}`;
  },
};

export const tableInput2 = {
  /**
   * Get add button
   * @param {string} [name] - Collection name
   * @returns Test data id
   */
  addBtn(name: string = "Collection") {
    return `tableInput2AddBtn-${name}`;
  },
  /**
   * Get remove button element
   * @param {number} row
   * @param {string} [name] - Collection name
   * @returns Test data id
   */
  deleteBtn(row: number = 0, name: string = "Collection") {
    return `tableInput2DeleteBtn${row}-${name}`;
  },
  /**
   * Get field element
   * @param {string} fieldName
   * @param {number} [row]
   * @param {string} [collectionName]
   * @returns Test data id
   */
  inputField(
    fieldName: string,
    row: number = 0,
    collectionName: string = "Collection"
  ) {
    return `tableInput2Field-${fieldName}${row}-${collectionName}`;
  },
};
