const xlsx = require("xlsx");
const { excelDateToJSDate } = require("../utils/utils");
const Agent = require("../models/agent.model");
const User = require("../models/user.model");
const Account = require("../models/account.model");
const Category = require("../models/category.model");
const Carrier = require("../models/carrier.model");
const Policy = require("../models/policy.model");

exports.processExcel = async (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  await insertAgents(jsonData);
  const users = await insertUsers(jsonData);
  await insertAccounts(jsonData, users);
  await insertCategories(jsonData);
  await insertCarriers(jsonData);
  await insertPolicies(jsonData);
};

// Function to insert Agents
async function insertAgents(data) {
  const agents = data.map((item) => ({ agentName: item.agent }));
  await Agent.insertMany(agents);
}

// async function insertAgents(data) {
//   const uniqueAgents = [...new Set(data.map((item) => item.agent))];
//   const agents = uniqueAgents.map((name) => ({ agentName: name }));

//   await Agent.insertMany(agents, { ordered: false }).catch((err) => {
//     if (err.code !== 11000) throw err;
//   });
// }

// const BATCH_SIZE = 500;

// // Function to insert in batches
// async function insertAgentsInBatches(data) {
//   for (let i = 0; i < data.length; i += BATCH_SIZE) {
//     const batch = data.slice(i, i + BATCH_SIZE);
//     await Agent.insertMany(batch);
//   }
// }

// Function to insert Users
async function insertUsers(data) {
  const usersData = data.map((item) => ({
    firstName: item.firstname,
    dob: excelDateToJSDate(item.dob),
    address: item.address,
    phoneNumber: item.phone,
    state: item.state,
    city: item.city,
    zipCode: item.zip,
    email: item.email,
    gender: item.gender,
    userType: item.userType,
  }));
  await User.insertMany(usersData);
  return await User.find();
}

// Function to insert Accounts
async function insertAccounts(data, users) {
  const accounts = data.map((item) => {
    const user = users.find(
      (u) => u.firstName === item.firstname && u.email === item.email
    );
    return {
      accountName: item.account_name,
      accountType: item.account_type,
      userId: user ? user._id : null,
    };
  });
  const validAccounts = accounts.filter((acc) => acc.userId);
  await Account.insertMany(validAccounts);
}

//Function to Insert Category

async function insertCategories(data) {
  const uniqueCategories = [...new Set(data.map((item) => item.category_name))];

  const categories = uniqueCategories.map((name) => ({ categoryName: name }));
  await Category.insertMany(categories, { ordered: false }).catch((err) => {
    if (err.code !== 11000) throw err; // Ignore duplicates
  });
}

//Function to Insert Carriers
async function insertCarriers(data) {
  const carriers = data.map((item) => ({ companyName: item.company_name }));
  await Carrier.insertMany(carriers);
}

//Function to Insert policies

async function insertPolicies(data) {
  const users = await User.find();
  const categories = await Category.find();
  const carriers = await Carrier.find();

  const policies = data.map((item) => {
    const user = users.find(
      (u) => u.firstName === item.firstname && u.email === item.email
    );
    const category = categories.find(
      (c) => c.categoryName === item.category_name
    );
    const carrier = carriers.find((c) => c.companyName === item.company_name);

    return {
      policyNumber: item.policy_number,
      policyStartDate: excelDateToJSDate(item.policy_start_date),
      policyEndDate: excelDateToJSDate(item.policy_end_date),
      premiumAmount: item.premium_amount,
      policyType: item.policy_type,
      policyMode: item.policy_mode,
      producer: item.producer,
      csr: item.csr,
      policyCategory: category ? category._id : null,
      policyCarrier: carrier ? carrier._id : null,
      userId: user ? user._id : null,
    };
  });

  await Policy.insertMany(policies);
}
