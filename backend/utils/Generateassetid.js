const Counter = require('../models/Counter')

// e.g. "BVM/HW/F206/RCH/01"
//        |   |   |    |   |
//        |   |   |    |   +-- serial number within this lab, per item type
//        |   |   |    +------ resource code (abbreviation of resource name)
//        |   |   +----------- lab code (derived from lab name)
//        |   +--------------- type code: HW (Hardware) or SW (Software)
//        +------------------- institute code
const INSTITUTE_CODE = process.env.INSTITUTE_CODE || 'BVM'

const TYPE_CODES = {
    Hardware: 'HW',
    Software: 'SW',
}

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

// Atomically bumps the counter for this (labCode, resourceCode) pair and
// returns the new value — safe even if two "add resource" requests land
// at the same time.
const nextSerialNumber = async (labCode, resourceCode) => {
    const key = `${labCode}_${resourceCode}`
    const counter = await Counter.findOneAndUpdate(
        { key },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    )
    return counter.seq
}

// { labName, resourceName, resourceType } -> { assetId, labCode, resourceCode, serialNumber, typeCode }
const generateAssetId = async ({ labName, resourceName, resourceType }) => {
    const typeCode = TYPE_CODES[resourceType]
    if (!typeCode) {
        throw new Error("resourceType must be 'Hardware' or 'Software'")
    }

    const labCode = deriveLabCode(labName)
    const resourceCode = deriveResourceCode(resourceName)
    const serialNumber = await nextSerialNumber(labCode, resourceCode)
    const serialStr = String(serialNumber).padStart(2, '0')

    const assetId = `${INSTITUTE_CODE}/${typeCode}/${labCode}/${resourceCode}/${serialStr}`

    return { assetId, labCode, resourceCode, serialNumber, typeCode }
}

module.exports = generateAssetId