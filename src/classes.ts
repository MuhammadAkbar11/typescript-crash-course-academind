abstract class Department {
  // private readonly id: string
  // public name: string;
  protected employees: string[] = [];
  constructor(protected readonly id: string, public name: string) {
    // this.id = id;
    // this.name = n;
  }

  static createEmployee(name: string) {
    return { name: name };
  }

  abstract describe(this: Department): void;

  addEmployee(employee: string) {
    this.employees.push(employee);
  }

  printEmployeeInformation() {
    console.info(`Employess: ${this.employees.join(",")}`);
    console.log(`Total Employess: ${this.employees.length} \n`);
  }
}

class ITDepartment extends Department {
  admins: string[];
  constructor(id: string, admins: string[]) {
    super(id, "IT");
    this.admins = admins;
  }

  describe() {
    console.log(`IT Departement - ID: ${this.id}`);
  }

  printAdmis() {
    console.log(this.admins);
  }
}

class AccountingDepartment extends Department {
  private lastReport: string;
  private static instance: AccountingDepartment;

  get mostRecentReport(): any {
    if (this.lastReport) {
      return this.lastReport;
    }
    console.error("[error] No Report Found.");
  }

  set mostRecentReport(value: string) {
    if (!value) {
      console.error("[error] Please pass in a valid value");
    }
    this.addReport(value);
  }

  private constructor(id: string, private reports: string[]) {
    super(id, "Accounting");
    this.lastReport = reports[0];
  }

  static getInstance() {
    if (AccountingDepartment.instance) {
      return this.instance;
    }
    this.instance = new AccountingDepartment("d2", []);
    return this.instance;
  }

  describe() {
    console.log(`Accounting Departement - ID: ${this.id}`);
  }

  addEmployee(name: string) {
    const exists = this.employees.filter(n => n.trim() === name.trim());

    if (exists.length !== 0) {
      return console.error(
        `[error] Employee with name "${name}" already exist`
      );
    }
    this.employees.push(name);
  }

  addReport(text: string) {
    this.reports.push(text);
    this.lastReport = text;
  }

  printReports() {
    console.log(this.reports);
  }
}

const employee1 = Department.createEmployee("max");
console.log("employee1", employee1);
const it = new ITDepartment("d2", ["Jihyo"]);

it.addEmployee("Nayeon");
it.addEmployee("Cy");
for (let idx = 0; idx < 5; idx++) {
  it.addEmployee(`Baev ${idx}`);
}
it.describe();
it.printEmployeeInformation();
it.printAdmis();

// const accounting = new AccountingDepartment("d2", []);
const accounting = AccountingDepartment.getInstance();
const accounting2 = AccountingDepartment.getInstance();

console.log(accounting, accounting2);

accounting.mostRecentReport = "Good Request";
accounting.addEmployee("Chaeyoung");
accounting.addEmployee("Hirai Momo");
accounting.addEmployee("Tzuyu");
accounting.describe();
accounting.printEmployeeInformation();
accounting.addReport("Something went wrong");
accounting.addReport("Server Error");
accounting.addReport("Not found");
accounting.printReports();
console.log("Recent report :", accounting.mostRecentReport);