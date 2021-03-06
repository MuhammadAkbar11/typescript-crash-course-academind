enum ProjectStatus {
  Active,
  Finished,
}

interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
  dragEnterHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHander(event: DragEvent): void;
}

const initProjects = [
  {
    id: "1",
    title: "Dummy",
    description: "Dummy Description",
    people: 3,
    status: ProjectStatus.Active,
    order: 1,
  },
  {
    id: "2",
    title: "Dummy 2 ",
    description: "Dummy Description 2",
    people: 4,
    status: ProjectStatus.Active,
    order: 2,
  },
  {
    id: "3",
    title: "Dummy End",
    description: "Dummy End Description",
    people: 6,
    status: ProjectStatus.Active,
    order: 3,
  },
];

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus,
    public order: number
  ) {}
}

type Listener<T> = (items: T[]) => void;

class State<ST> {
  protected listeners: Listener<ST>[] = [];

  addListener(listenersFn: Listener<ST>) {
    this.listeners.push(listenersFn);
  }
}

class ProjectState extends State<Project> {
  private projectActiveId: any = null;
  private projectIdInc: number = 1;
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
    this.projects = [...initProjects];
    this.initDefaultState();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new ProjectState();
    return this.instance;
  }

  private initDefaultState() {
    for (const initPrj of initProjects) {
      if (initPrj instanceof Project === false) {
        const indexOf = this.projects.findIndex(el => el.id === initPrj.id);
        const transformToProject = new Project(
          this.projectIdInc.toString(),
          initPrj.title,
          initPrj.description,
          initPrj.people,
          initPrj.status,
          this.projectIdInc
        );
        this.projectIdInc++ + 1;
        this.projects[indexOf] = transformToProject;
      }
    }
  }

  setProjectActiveId(id: string) {
    this.projectActiveId = id;
  }

  getProjectActiveId() {
    return this.projectActiveId;
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      this.projectIdInc.toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active,
      this.projectIdInc
    );
    this.projects.push(newProject);
    this.projectIdInc++ + 1;
    this.updateListeners();
  }

  findOne(projectId: string) {
    return this.projects.find(prj => prj.id === projectId);
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const selectedProject = this.findOne(projectId);

    if (selectedProject && selectedProject.status !== newStatus) {
      selectedProject.status = newStatus;
      this.updateListeners();
    }
  }

  deleteProject(projectId: string) {
    const updatedProjects = this.projects.filter(prj => prj.id !== projectId);
    this.projects = updatedProjects;
    this.updateListeners();
  }

  swapProject(fromId: string, toId: string) {
    const fromIndex = this.projects.findIndex(el => el.id === fromId);
    const toIndex = this.projects.findIndex(el => el.id === toId);

    const fromOrder = this.projects[fromIndex].order;
    const toOrder = this.projects[toIndex].order;

    this.projects[fromIndex].order = +toOrder;
    this.projects[toIndex].order = +fromOrder;

    this.updateListeners();
  }

  private updateListeners() {
    for (const listenersFn of this.listeners) {
      listenersFn(this.projects.slice());
    }
  }

  public getProjects() {
    return this.projects;
  }
}

const projectState = ProjectState.getInstance();

// Validation
interface Validatable {
  value: string | number;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;

  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }

  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }

  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }

  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }

  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }

  return isValid;
}

// Auto Bind
function AutoBind(
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };

  return adjDescriptor;
}

interface ComponentParam {
  templateId: string;
  hostElementId: string;
  insertPosition: InsertPosition;
  newElementId?: string;
}

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor({ ...options }: ComponentParam) {
    const { templateId, hostElementId, insertPosition, newElementId } = options;

    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;

    if (newElementId) this.element.id = newElementId;
    this.attach(insertPosition);
  }

  private attach(insertPos: InsertPosition = "beforeend") {
    this.hostElement.insertAdjacentElement(insertPos, this.element);
  }

  abstract configure?(): void;
  abstract render(): void;
}

class ProjectContainer extends Component<HTMLDivElement, HTMLDivElement> {
  constructor() {
    super({
      templateId: "project-container",
      hostElementId: "root",
      insertPosition: "afterbegin",
      // newElementId: ``,
    });
  }

  configure() {}
  render() {}
}

class ProjectItem
  extends Component<HTMLDivElement, HTMLElement>
  implements Draggable
{
  private project: Project;
  btnDelete: HTMLButtonElement;

  get persons() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} persons`;
    }
  }

  constructor(hostId: string, project: Project) {
    super({
      templateId: "single-project",
      hostElementId: hostId,
      insertPosition: "beforeend",
      newElementId: `project-col-${project.id}`,
    });
    this.project = project;
    this.btnDelete = this.element.querySelector(
      "#btn-delete"
    )! as HTMLButtonElement;

    this.configure();
    this.render();
  }

  @AutoBind
  dragStartHandler(event: DragEvent): void {
    projectState.setProjectActiveId(this.project.id);
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  @AutoBind
  dragEndHandler(_event: DragEvent): void {
    console.log("END", this.project.title);
  }

  @AutoBind
  dragEnterHandler(_event: DragEvent) {
    if (this.project.id !== projectState.getProjectActiveId()) {
      this.element.classList.add("over");
      // console.log(event.target.c)
    }
  }

  @AutoBind
  dragLeaveHandler(_event: DragEvent) {
    this.element.classList.remove("over");
  }

  @AutoBind
  dragDropHandler(_event: DragEvent) {
    projectState.swapProject(
      projectState.getProjectActiveId(),
      this.project.id
    );

    this.element.classList.remove("bg-light");
  }

  @AutoBind
  dragDragOver(event: DragEvent) {
    event.preventDefault();
  }

  @AutoBind
  deleteItemHandler(_event: MouseEvent) {
    projectState.deleteProject(this.project.id);
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
    this.element.addEventListener("dragenter", this.dragEnterHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("dragover", this.dragDragOver);
    this.element.addEventListener("drop", this.dragDropHandler);
    this.btnDelete.addEventListener("click", this.deleteItemHandler);
  }

  render() {
    this.element.draggable = true;
    this.element.querySelector("#subheading")!.textContent = this.project.title;
    this.element.querySelector("#content")!.textContent =
      this.project.description;
    this.element.querySelector(
      "#badge-people"
    )!.textContent = `${this.persons} assigned`;
  }
}

class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super({
      templateId: "project-list",
      hostElementId: "project-list-col",
      insertPosition: "beforeend",
      newElementId: `${type}-projects-list-section`,
    });
    this.type = type;
    this.assignedProjects = [];
    this.configure();
    this.render();
    this.renderProjects();
  }

  @AutoBind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listProjectCard = this.element.querySelector(
        `.project-list-card`
      )! as HTMLDivElement;
      listProjectCard.classList.add("droppable");
    }
  }
  @AutoBind
  dropHandler(event: DragEvent): void {
    const prjId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(
      prjId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
    const listProjectCard = this.element.querySelector(
      `.project-list-card`
    )! as HTMLDivElement;
    listProjectCard.classList.remove("droppable");
  }
  @AutoBind
  dragLeaveHander(_event: DragEvent): void {
    const listProjectCard = this.element.querySelector(
      `.project-list-card`
    )! as HTMLDivElement;
    listProjectCard.classList.remove("droppable");
  }

  renderProjects() {
    const listProjectRow = this.element.querySelector(
      `#${this.type}-projects-list`
    )! as HTMLUListElement;
    listProjectRow.innerHTML = "";
    const relevantProjects = projectState
      .getProjects()
      .filter(prj => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      })
      .sort((a, b) => Number(b.order) - Number(a.order));
    this.assignedProjects = relevantProjects;
    console.log(this.assignedProjects);
    for (const project of this.assignedProjects) {
      if (!!project) {
        new ProjectItem(listProjectRow.id, project);
      }
    }
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHander);
    this.element.addEventListener("drop", this.dropHandler);

    projectState.addListener((_projects: Project[]) => {
      this.renderProjects();
    });
  }

  render() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("#project-list-row")!.id = listId;
    const titleProjectList = this.element.querySelector(
      "#title-projects-list"
    )! as HTMLHeadingElement;
    titleProjectList.textContent = this.type + " Projects";
  }
}

class ProjectInput extends Component<HTMLDivElement, HTMLDivElement> {
  formElement: HTMLFormElement;
  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    super({
      templateId: "project-input",
      hostElementId: "project-input-col",
      insertPosition: "beforeend",
    });

    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;

    this.formElement = this.element.querySelector("form") as HTMLFormElement;

    this.titleInputEl = this.formElement.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputEl = this.formElement.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInputEl = this.formElement.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure();
  }

  private getherUserInput(): [string, string, number] | undefined {
    const enteredTitle = this.titleInputEl.value;
    const enteredDescription = this.descriptionInputEl.value;
    const enteredPeople = +this.peopleInputEl.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };

    const descValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };

    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 10,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid Input, Please try again");
      return;
    }

    return [enteredTitle, enteredDescription, enteredPeople];
  }

  private clearInput() {
    this.titleInputEl.value = "";
    this.descriptionInputEl.value = "";
    this.peopleInputEl.value = "";
  }

  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.getherUserInput();

    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      projectState.addProject(title, desc, people);
      this.clearInput();
    }
  }

  render(): void {}

  configure() {
    this.formElement.addEventListener("submit", this.submitHandler);
  }
}

const projectContainer = new ProjectContainer();
const projectInput = new ProjectInput();
const projectListActive = new ProjectList("active");
const projectListFinished = new ProjectList("finished");
