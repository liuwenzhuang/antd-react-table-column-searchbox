import * as React from "react";
import { Icon, Input } from "antd";
import contains from "rc-util/lib/Dom/contains";
import { debounce } from "lodash";

const filterInitialState = {
  searching: false,
  searchText: ""
};

type FilterState = Readonly<typeof filterInitialState>;
export default class FilterHeader extends React.PureComponent<
  any,
  FilterState
> {
  public readonly state: FilterState = filterInitialState;
  public searchRef: Input | null;
  public parentRef: HTMLSpanElement | null;

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.delayEmitSearch = debounce(this.delayEmitSearch, 300);
  }

  public componentWillUnmount() {
    document.removeEventListener("click", this.onBlur, false);
  }

  public render() {
    const { children } = this.props;
    const { searching, searchText } = this.state;
    const suffix = (
      <Icon
        type="close"
        onClick={e => this.clearSearch(e)}
        style={{
          color: "rgba(0,0,0,.25)",
          cursor: "pointer",
          opacity: searchText ? 1 : 0
        }}
      />
    );
    return (
      <th>
        <span>
          <div>
            <span>{children}</span>
            <span
              ref={node => {
                this.parentRef = node;
              }}
            >
              {!searching && (
                <Icon
                  type="search"
                  onClick={() => {
                    this.onTriggerSearch(true);
                  }}
                  style={{ cursor: "pointer" }}
                />
              )}
              <Input
                ref={node => {
                  this.searchRef = node;
                }}
                size="small"
                value={searchText}
                onChange={e => this.onSearch(e)}
                onPressEnter={e => this.onSearch(e)}
                prefix={
                  <Icon type="search" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                suffix={suffix}
                style={{ width: "188px", opacity: searching ? 1 : 0 }}
              />
            </span>
          </div>
        </span>
      </th>
    );
  }

  /**
   * 点击输入框之外，关闭输入框
   * @param e
   */
  private onBlur(e) {
    if (contains(this.parentRef, e.target)) {
      return;
    }
    this.onTriggerSearch(false);
  }

  /**
   * 触发搜索
   */
  private onTriggerSearch = (searching: boolean = true) => {
    this.setState({
      searching
    });
    const inputRef = this.searchRef;
    if (!inputRef) {
      return;
    }
    if (searching) {
      inputRef.focus();
      document.addEventListener("click", this.onBlur, false);
    } else {
      inputRef.select();
      document.removeEventListener("click", this.onBlur, false);
    }
  };

  /**
   * 清除输入框内容
   */
  private clearSearch = e => {
    e.stopPropagation();
    const { onSearch } = this.props;
    this.setState({
      searchText: ""
    });
    onSearch("");
    if (this.searchRef) {
      this.searchRef.focus(); // 重新focus输入框
    }
  };

  /**
   * input变化事件回调
   */
  private onSearch = e => {
    e.persist();
    const searchText = e.target.value ? e.target.value : "";
    this.setState({
      searchText
    });
    this.delayEmitSearch(searchText);
  };

  /**
   * 延迟触发搜索
   */
  private delayEmitSearch = (searchText: string) => {
    const { onSearch } = this.props;
    onSearch(searchText);
  };
}
