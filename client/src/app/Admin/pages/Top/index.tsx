import React from "react";
import aixos from "axios";
import { Button, Dialog, Card, Icon } from "@blueprintjs/core";
import Main from "~/components/Main";
import styles from "./Top.css";
import AddEmployee from "./AddEmployee";
import Employee from "../..";

interface State {
  employees: {
    total: number;
    list: Employee[];
  };
  isAddingEmployee: boolean;
}

export default class Top extends React.PureComponent<{}, State> {
  state: State = {
    employees: {
      list: [],
      total: 0
    },
    isAddingEmployee: false
  };

  async componentDidMount() {
    const { data } = await aixos.get("/api/v1/employees");
    this.setState({
      employees: data
    });
  }

  showNewEmployDialog = (e: React.MouseEvent) => {
    this.setState({
      isAddingEmployee: true
    });
  };

  hideNewEmployeeDialog = (e?: React.SyntheticEvent<HTMLElement, Event>) => {
    this.setState({
      isAddingEmployee: false
    });
  };

  onCreatedEmployee = (employee: Employee) => {
    const { employees } = this.state;
    this.setState({
      employees: {
        total: employees.total + 1,
        list: employees.list.concat(employee)
      }
    });
    this.hideNewEmployeeDialog();
  };

  render() {
    const { employees, isAddingEmployee } = this.state;
    return (
      <Main>
        <p className={styles.title}>
          There are {employees.total} employees{" "}
          <Button
            icon="plus"
            className={styles.add}
            onClick={this.showNewEmployDialog}
          >
            Add Employee
          </Button>
        </p>

        <div className={styles.employeeList}>
          {employees.list.map(employee => (
            <Card
              interactive
              className={styles.employeeCard}
              key={employee.employee_id}
            >
              <Icon icon="user" iconSize={50} color={"#eee"} />
              <div className={styles.employeeInfo}>
                {employee.name}
                <br />
                <small>{employee.employee_id}</small>
              </div>
            </Card>
          ))}
        </div>
        <Dialog
          title="Add new employee"
          isOpen={isAddingEmployee}
          onClose={this.hideNewEmployeeDialog}
        >
          <AddEmployee onCreated={this.onCreatedEmployee} />
        </Dialog>
      </Main>
    );
  }
}
