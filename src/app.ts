class Department {
  // private readonly id : string
  // public name: string;
  private employees: string[] = [];
  constructor(private readonly id: string, public name: string) {
    // this.id = id;
    // this.name = n;
  }

  describe(this: Department) {
    console.log(`Departement: (${this.id}): ${this.name}`);
  }

  addEmployee(employee: string) {
    this.employees.push(employee);
  }

  printEmployeeInformation() {
    console.info(`${this.employees.join(",")} (${this.employees.length})`);
  }
}

class ITDepartment extends Department {
  admins: string[];
  constructor(id: string, admins: string[]) {
    super(id, "IT");
    this.admins = admins;
  }
  printAdmis() {
    console.log("admins :>> ", this.admins);
  }
}

class AccountingDepartment extends Department {
  constructor(id: string, private reports: string[]) {
    super(id, "Accounting");
  }
  addReport(text: string) {
    this.reports.push(text);
  }

  printReports() {
    console.log(this.reports);
  }
}

const it = new ITDepartment("d2", ["Jihyo"]);

it.addEmployee("Nayeon");
it.addEmployee("Cy");
for (let idx = 0; idx < 5; idx++) {
  it.addEmployee(`Baev ${idx}`);
}
it.describe();
it.printEmployeeInformation();
it.printAdmis();

const accounting = new AccountingDepartment("d2", []);
accounting.addEmployee("Chaeyoung");
accounting.addEmployee("Hirai Momo");
accounting.printEmployeeInformation();
accounting.addReport("Something went wrong");
accounting.addReport("Server Error");
accounting.printReports();
