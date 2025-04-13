/**
 * @typedef {"customer" | "shopkeeper" | "admin"} UserRole
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {UserRole} role
 */

/**
 * @typedef {Object} Shop
 * @property {string} id
 * @property {string} name
 * @property {string} ownerId
 * @property {{ lat: number, lng: number }} location
 * @property {string} address
 * @property {number} rating
 * @property {string} [machineId]
 * @property {boolean} isApproved
 */

/**
 * @typedef {"off" | "low" | "medium" | "high"} FanSpeed
 */

/**
 * @typedef {Object} Machine
 * @property {string} id
 * @property {string} shopId
 * @property {number} batteryPercentage
 * @property {number} solarEfficiency
 * @property {boolean} isCharging
 * @property {number} speed
 * @property {boolean} isPaymentMachineOn
 * @property {boolean} isLightOn
 * @property {FanSpeed} fanSpeed
 */

/**
 * @typedef {"pending" | "processing" | "completed" | "cancelled"} OrderStatus
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} customerId
 * @property {string} shopId
 * @property {number} glassCount
 * @property {OrderStatus} status
 * @property {number} timestamp
 */

/**
 * @typedef {"pending" | "approved" | "rejected"} RegistrationStatus
 */

/**
 * @typedef {Object} ShopRegistration
 * @property {string} id
 * @property {string} shopkeeperId
 * @property {string} shopName
 * @property {string} address
 * @property {{ lat: number, lng: number }} location
 * @property {string} [machineId]
 * @property {RegistrationStatus} status
 * @property {number} timestamp
 */
