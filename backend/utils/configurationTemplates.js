
const CONFIGURATION_TEMPLATES = {
    Desktops: [
        { key: "brand", label: "Brand" },
        { key: "display", label: "Display" },
        { key: "processor", label: "Processor" },
        { key: "graphicsCard", label: "Graphics Card" },
        { key: "ram", label: "RAM" },
        { key: "storage", label: "Storage" },
        { key: "operatingSystem", label: "Operating System" },
        { key: "osVersion", label: "OS Version" },
        { key: "installedSoftware", label: "Installed Software" },
    ],
    Laptops: [
        { key: "brand", label: "Brand" },
        { key: "model", label: "Model" },
        { key: "displaySizeResolution", label: "Display Size and Resolution" },
        { key: "processor", label: "Processor" },
        { key: "graphicsCard", label: "Graphics Card" },
        { key: "ram", label: "RAM" },
        { key: "storage", label: "Storage" },
        { key: "operatingSystem", label: "Operating System" },
        { key: "osVersion", label: "OS Version" },
        { key: "installedSoftware", label: "Installed Software" },
    ],
    Servers: [
        { key: "brand", label: "Brand" },
        { key: "model", label: "Model" },
        { key: "processors", label: "Processor(s)" },
        { key: "ram", label: "RAM" },
        { key: "storageCapacityType", label: "Storage Capacity and Type" },
        { key: "raidConfiguration", label: "RAID Configuration" },
        { key: "networkInterfaces", label: "Network Interfaces" },
        { key: "operatingSystem", label: "Operating System" },
        { key: "osVersion", label: "OS Version" },
        { key: "serverRole", label: "Server Role / Purpose" },
    ],
    Monitors: [
        { key: "brand", label: "Brand" },
        { key: "model", label: "Model" },
        { key: "screenSize", label: "Screen Size" },
        { key: "resolution", label: "Resolution" },
        { key: "panelType", label: "Panel Type" },
        { key: "refreshRate", label: "Refresh Rate" },
        { key: "ports", label: "Connectivity / Ports" },
    ],
    CPUs: [
        { key: "brand", label: "Brand" },
        { key: "model", label: "Model" },
        { key: "processor", label: "Processor" },
        { key: "ram", label: "RAM" },
        { key: "storage", label: "Storage" },
        { key: "graphicsCard", label: "Graphics Card" },
        { key: "powerSupply", label: "Power Supply" },
    ],
    Keyboards: [
        { key: "brand", label: "Brand" },
        { key: "model", label: "Model" },
        { key: "keyboardType", label: "Keyboard Type" },
        { key: "connectivity", label: "Connectivity" },
        { key: "layout", label: "Layout" },
    ],
    Mouse: [
        { key: "brand", label: "Brand" },
        { key: "model", label: "Model" },
        { key: "mouseType", label: "Mouse Type" },
        { key: "connectivity", label: "Connectivity" },
        { key: "dpi", label: "DPI / Sensitivity" },
    ],
    Printers: [
        { key: "brand", label: "Brand" },
        { key: "model", label: "Model" },
        { key: "printerType", label: "Printer Type" },
        { key: "printTechnology", label: "Print Technology" },
        { key: "colorSupport", label: "Color Support" },
        { key: "connectivity", label: "Connectivity" },
        { key: "duplexPrinting", label: "Duplex Printing" },
    ],
    Projectors: [
        { key: "brand", label: "Brand" },
        { key: "model", label: "Model" },
        { key: "resolution", label: "Resolution" },
        { key: "brightness", label: "Brightness" },
        { key: "projectionTechnology", label: "Projection Technology" },
        { key: "lampLife", label: "Lamp Life" },
        { key: "connectivity", label: "Connectivity" },
    ],
    "Networking Equipment": [
        { key: "brand", label: "Brand" },
        { key: "model", label: "Model" },
        { key: "deviceType", label: "Device Type" },
        { key: "ports", label: "Number / Type of Ports" },
        { key: "networkSpeed", label: "Network Speed" },
        { key: "wirelessStandard", label: "Wireless Standard" },
        { key: "managementCapability", label: "Management Capability" },
    ],
    "Power Backup": [
        { key: "brand", label: "Brand" },
        { key: "model", label: "Model" },
        { key: "formFactor", label: "Form Factor" },
        { key: "capacityKVA", label: "Capacity (kVA)" },
        { key: "powerRatingKW", label: "Power Rating (kW)" },
        { key: "batteryType", label: "Battery Type" },
        { key: "backupTime", label: "Backup Time" },
    ],
    "Raspberry Pi Kits": [
        { key: "boardModel", label: "Board Model" },
        { key: "processor", label: "Processor" },
        { key: "ram", label: "RAM" },
        { key: "storage", label: "Storage" },
        { key: "powerSupply", label: "Power Supply" },
        { key: "includedAccessories", label: "Included Accessories" },
        { key: "operatingSystem", label: "Operating System" },
    ],
    Furniture: [
        { key: "furnitureType", label: "Furniture Type" },
        { key: "brand", label: "Brand" },
        { key: "material", label: "Material" },
        { key: "dimensions", label: "Dimensions" },
        { key: "color", label: "Color" },
        { key: "capacity", label: "Seating / Load Capacity" },
    ],
    "Electrical Equipment": [
        { key: "brand", label: "Brand" },
        { key: "model", label: "Model" },
        { key: "equipmentType", label: "Equipment Type" },
        { key: "voltage", label: "Voltage" },
        { key: "powerRating", label: "Power Rating" },
        { key: "phase", label: "Phase" },
    ],
    Cameras: [
        { key: "brand", label: "Brand" },
        { key: "model", label: "Model" },
        { key: "cameraType", label: "Camera Type" },
        { key: "resolution", label: "Resolution" },
        { key: "sensorType", label: "Sensor Type" },
        { key: "connectivity", label: "Connectivity" },
    ],
    "Software Licenses": [
        { key: "softwareName", label: "Software Name" },
        { key: "version", label: "Version" },
        { key: "licenseType", label: "License Type" },
        { key: "licenseCount", label: "Number of Licenses" },
        { key: "validity", label: "Validity / Expiry" },
        { key: "deploymentType", label: "Deployment Type" },
        { key: "platform", label: "Supported Platform" },
    ],
};

const validateConfiguration = (category, configuration) => {
    const template = CONFIGURATION_TEMPLATES[category];

    if (!template) {
        throw new Error(`No configuration template found for category "${category}".`);
    }

    const missingFields = template
        .filter(({ key }) => {
            const value = configuration?.[key];
            return typeof value !== "string" || !value.trim();
        })
        .map(({ label }) => label);

    if (missingFields.length > 0) {
        throw new Error(
            `Please complete the following configuration fields: ${missingFields.join(", ")}`
        );
    }

    return Object.fromEntries(
        template.map(({ key }) => [key, configuration[key].trim()])
    );
};

module.exports = {
    CONFIGURATION_TEMPLATES,
    validateConfiguration,
};
