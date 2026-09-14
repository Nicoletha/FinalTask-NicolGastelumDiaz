/**
 * Data provider for UC-2 (Cart State Logic).
 * Each set defines two distinct items to add and which of the two
 * gets removed afterward, allowing the same test to run against
 * different product combinations.
 */
module.exports = [
    {
        description: 'Backpack + Bike Light, Backpack removed',
        itemToAdd1: 'Sauce Labs Backpack',
        itemToAdd2: 'Sauce Labs Bike Light',
        itemToRemove: 'Sauce Labs Backpack'
    },
    {
        description: 'Bolt T-Shirt + Fleece Jacket, Fleece Jacket removed',
        itemToAdd1: 'Sauce Labs Bolt T-Shirt',
        itemToAdd2: 'Sauce Labs Fleece Jacket',
        itemToRemove: 'Sauce Labs Fleece Jacket'
    }
];