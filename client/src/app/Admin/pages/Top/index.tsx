import React from "react";
import aixos from "axios";
import { Button, Dialog } from "@blueprintjs/core";
import Main from "~/components/Main";
import styles from "./Top.css";

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

  render() {
    const { employees, isAddingEmployee } = this.state;
    return (
      <Main>
        <p>
          there are {employees.total} employees{" "}
          <Button
            icon="plus"
            className={styles.add}
            onClick={this.showNewEmployDialog}
          >
            Add Employee
          </Button>
          <Dialog
            title="Add new employee"
            isOpen={isAddingEmployee}
            onClose={this.hideNewEmployeeDialog}
          >
            holy shit
          </Dialog>
        </p>
      </Main>
    );
  }
}
