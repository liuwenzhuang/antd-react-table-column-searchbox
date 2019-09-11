import * as React from "react";
import { render } from "react-dom";
import "antd/dist/antd.css";
import { Table } from "antd";
import { TableComponents } from "antd/es/table";
import FilterHeader from "./filter-header";

import "./styles.css";

const columns = [
  {
    title: "Name",
    dataIndex: "name"
  },
  {
    title: "Age",
    dataIndex: "age"
  },
  {
    title: "Address",
    dataIndex: "address"
  }
];

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park"
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park"
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park"
  },
  {
    key: "4",
    name: "Jim Red",
    age: 32,
    address: "London No. 2 Lake Park"
  }
];

const initialState = {
  searchText: ""
};

type State = Readonly<typeof initialState>;

class App extends React.Component<any, State> {
  public readonly state: State = initialState;
  public components: TableComponents = {
    header: {
      cell: attr => {
        const {
          children: { key }
        } = attr;
        return key === "name" ? (
          <FilterHeader onSearch={this.onSearch} {...attr} />
        ) : (
          <th {...attr} />
        );
      }
    }
  };
  render() {
    const { searchText } = this.state;
    const source = data.filter(item => item.name.includes(searchText));
    return (
      <div className="App">
        <h1>Antd-React-Table-Column-Searchbox</h1>
        <Table
          columns={columns}
          dataSource={source}
          components={this.components}
        />
      </div>
    );
  }
  private onSearch = (searchText: string) => {
    this.setState({
      searchText
    });
  };
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
