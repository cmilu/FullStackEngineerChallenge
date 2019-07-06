import React from "react";
import { Button } from "@blueprintjs/core";
import Axios from "axios";
import styles from "./AddEmployee.css";

interface Props {
  onCreated: (employee: Employee) => void;
}

type State = Omit<Employee, "id">;

export default class AddEmployee extends React.PureComponent<Props, State> {
  state: State = {
    employee_id: "",
    name: ""
  };

  updateField = ({
    currentTarget: { name, value }
  }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      ...this.state,
      [name as keyof State]: value
    });
  };

  add = async () => {
    const { data } = await Axios.post("/api/v1/employees", this.state);
    this.props.onCreated(data);
  };

  render() {
    return (
      <div className={styles.outer}>
        <input
          className="bp3-input"
          type="text"
          placeholder="name"
          name="name"
          onChange={this.updateField}
        />
        <br />
        <br />
        <input
          className="bp3-input"
          type="text"
          placeholder="employ id"
          name="employee_id"
          onChange={this.updateField}
        />
        <br />
        <br />
        <Button onClick={this.add} intent="success" className={styles.save}>
          Save
        </Button>
      </div>
    );
  }
}
