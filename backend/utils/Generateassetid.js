const Counter = require('../models/Counter')
const FundType = require('../models/FundType')
const { DEFAULT_FUND_TYPES } = require('./fundTypes')

// e.g. "BVM/GIA/HW/F206/RCH/01"
//        |   |   |  |    |   |
//        |   |   |  |    |   +-- serial number within this fund/lab/resource
//        |   |   |  |    |       combination
//        |   |   |  |    +------ resource code (abbreviation of resource name)
//        |   |   |  +----------- lab code (derived from lab name)
//        |   |   +-------------- type code: HW (Hardware) or SW (Software)
//        |   +------------------ fund type
//        +---------------------- institute code
const INSTITUTE_CODE = process.env.INSTITUTE_CODE || 'BVM'

const FUND_TYPES = new Set(DEFAULT_FUND_TYPES)

// Curated abbreviations for common lab items, based on the department's
// existing deadstock register conventions. Extend this as new resource
// types get added — anything not listed here falls back to an
// auto-generated code (see deriveResourceCode).
const RESOURCE_CODE_MAP = {
    'pc': 'PC',
    'computer': 'PC',
    'desktop': 'PC',
    'cpu': 'CPU',
    'monitor': 'MON',
    'projector': 'PROJ',
    'keyboard': 'KB',
    'mouse': 'MS',
    'printer': 'PRN',
    'scanner': 'SCN',
    'router': 'RTR',
    'switch': 'SWT',
    'ups': 'UPS',
    'server': 'SRV',
    'raspberry pi': 'RPI',
    'raspberry pi kit': 'RPI',
    'raspberry pi 4 kit': 'RPI',
    'whiteboard': 'WB',
    'white board': 'WB',
    'pin board': 'PB',
    'podium': 'PD',
    'drawer table': 'DTB',
    'stool': 'ST',
    'digital watch': 'DW',
    'round table': 'RTB',
    'teaching platform': 'TP',
    'fan': 'FAN',
    'ceiling light': 'CLT',
    'cupboard': 'CUP',
    'camera': 'CAM',
    'revolving chair': 'RCH',
    'chair': 'CHR',
    'table': 'TBL',
    'ac': 'AC',
    'air conditioner': 'AC',
    'software license': 'LIC',
    'license': 'LIC',
}

// Keeps only A-Z / 0-9, uppercased.
const slugCode = (text) =>
    text
        .toString()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')

// "F206 Lab" -> "F206", "DBMS Lab - Block B" -> "DBMSBLOCKB"
const deriveLabCode = (labName) => {
    const withoutLabWord = labName.toUpperCase().replace(/LAB(ORATORY)?/g, '')
    const code = slugCode(withoutLabWord)
    return code || slugCode(labName)
}

// Looks up a curated abbreviation first; otherwise builds one from the
// resource name itself (initials for multi-word names, first 3 letters
// for single-word names).
const deriveResourceCode = (resourceName) => {
    const key = resourceName.trim().toLowerCase()
    if (RESOURCE_CODE_MAP[key]) return RESOURCE_CODE_MAP[key]

    const words = resourceName.trim().split(/\s+/).filter(Boolean)
    if (words.length > 1) {
        const initials = words.map((w) => w[0]).join('').toUpperCase()
        return initials.length >= 2 ? initials : slugCode(words[0]).slice(0, 3)
    }
    return slugCode(words[0] || resourceName).slice(0, 3) || 'RES'
}

// Atomically bumps the counter for this (fundType, labCode, resourceCode) combination and
// returns the new value — safe even if two "add resource" requests land
// at the same time.
const nextSerialNumber = async (fundType, labCode, resourceCode) => {
    const key = `${fundType}_${labCode}_${resourceCode}`
    const counter = await Counter.findOneAndUpdate(
        { key },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    )
    return counter.seq
}

// { labName, resourceName, fundType } -> { assetId, labCode, resourceCode, serialNumber }
const generateAssetId = async ({ labName, resourceName, fundType }) => {
    const normalizedFundType = String(fundType || '').trim().toUpperCase()
    const isDefaultFundType = FUND_TYPES.has(normalizedFundType)
    const isAddedFundType = !isDefaultFundType && await FundType.exists({ code: normalizedFundType })
    if (!isDefaultFundType && !isAddedFundType) {
        throw new Error('fundType must be an existing fund type')
    }

    const labCode = deriveLabCode(labName)
    const resourceCode = deriveResourceCode(resourceName)
    const serialNumber = await nextSerialNumber(normalizedFundType, labCode, resourceCode)
    const serialStr = String(serialNumber).padStart(2, '0')

    const assetId = `${INSTITUTE_CODE}/${normalizedFundType}/${labCode}/${resourceCode}/${serialStr}`

    return { assetId, labCode, resourceCode, serialNumber }
}

module.exports = generateAssetId
module.exports.deriveLabCode = deriveLabCode