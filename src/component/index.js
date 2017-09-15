/* @flow */
import * as React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Check from './check';
import X from './x';
import { pointerCoord } from './util';

type ToggleProps = {
  checked?: boolean,
  disabled?: boolean,
  defaultChecked?: boolean,
  onChange?: Function,
  onFocus?: Function,
  onBlur?: Function,
  className?: string,
  name?: string,
  value?: string,
  id?: string,
  'aria-labelledby'?: string,
  'aria-label'?: string,
  icons?:
    | {|
        checked: React.Node,
        unchecked: React.Node,
      |}
    | boolean,
};

type ToggleState = {|
  checked: boolean,
  hasFocus: boolean,
|};

type InternalProperties = {|
  previouslyChecked: boolean,
  activated: boolean,
  startX?: number,
  moved: boolean,
|};

export default class Toggle extends React.PureComponent<
  ToggleProps,
  ToggleState,
> {
  props: ToggleProps;
  state: ToggleState;
  input: ?HTMLInputElement;
  internal: InternalProperties = {
    previouslyChecked: false,
    activated: false,
    startX: 0,
    moved: false,
  };

  static defaultProps = {
    icons: {
      checked: <Check />,
      unchecked: <X />,
    },
  };
  constructor(props: ToggleProps) {
    super(props);
    this.internal.previouslyChecked = !!(props.checked || props.defaultChecked);
    this.state = {
      checked: !!(props.checked || props.defaultChecked),
      hasFocus: false,
    };
  }

  componentWillReceiveProps(nextProps: ToggleProps) {
    if ('checked' in nextProps) {
      this.setState({ checked: !!nextProps.checked });
    }
  }

  handleClick = (event: SyntheticEvent<HTMLDivElement>) => {
    const checkbox = this.input;

    if (!checkbox) {
      return;
    }

    if (event.target !== checkbox && !this.internal.moved) {
      this.internal.previouslyChecked = checkbox.checked;
      event.preventDefault();
      checkbox.focus();
      checkbox.click();
      return;
    }

    const checked = this.props.checked ? this.props.checked : checkbox.checked;

    this.setState({ checked });
  };

  handleTouchStart = (event: SyntheticTouchEvent<HTMLDivElement>): void => {
    this.internal.startX = pointerCoord(event).x;
    this.internal.activated = true;
  };

  handleTouchMove = (event: SyntheticTouchEvent<HTMLDivElement>): void => {
    if (!this.internal.activated) return;
    const { startX } = this.internal;
    this.internal.moved = true;
    if (startX) {
      let currentX = pointerCoord(event).x;
      if (this.state.checked && currentX + 15 < startX) {
        this.setState({ checked: false });
        this.internal.startX = currentX;
        this.internal.activated = true;
      } else if (currentX - 15 > startX) {
        this.setState({ checked: true });
        this.internal.startX = currentX;
        this.internal.activated = currentX < startX + 5;
      }
    }
  };

  handleTouchEnd = (event: SyntheticTouchEvent<HTMLDivElement>): void => {
    if (!this.internal.moved) return;
    const checkbox = this.input;
    event.preventDefault();
    const { previouslyChecked, startX } = this.internal;

    if (checkbox && startX) {
      let endX = pointerCoord(event).x;
      if (previouslyChecked === true && startX + 4 > endX) {
        if (previouslyChecked !== this.state.checked) {
          this.setState({ checked: false });
          this.internal.previouslyChecked = this.state.checked;
          checkbox.click();
        }
      } else if (startX - 4 < endX) {
        if (previouslyChecked !== this.state.checked) {
          this.setState({ checked: true });
          this.internal.previouslyChecked = this.state.checked;
          checkbox.click();
        }
      }

      this.internal.activated = false;
      this.internal.startX = undefined;
      this.internal.moved = false;
    }
  };

  handleFocus = (event: SyntheticEvent<HTMLInputElement>) => {
    const { onFocus } = this.props;

    if (onFocus) {
      onFocus(event);
    }

    this.setState({ hasFocus: true });
  };

  handleBlur = (event: SyntheticEvent<HTMLInputElement>): void => {
    const { onBlur } = this.props;

    if (onBlur) {
      onBlur(event);
    }

    this.setState({ hasFocus: false });
  };

  getIcon = (type: 'checked' | 'unchecked'): React.Node => {
    const { icons } = this.props;
    if (typeof icons === 'boolean') {
      if (!icons) {
        return null;
      } else {
        return Toggle.defaultProps.icons[type];
      }
    } else if (typeof icons === 'object') {
      return icons[type] === undefined
        ? Toggle.defaultProps.icons[type]
        : icons[type];
    }
  };

  render() {
    const { className, icons: _icons, ...inputProps } = this.props;

    const classes = classNames(
      'react-toggle',
      {
        'react-toggle--checked': this.state.checked,
        'react-toggle--focus': this.state.hasFocus,
        'react-toggle--disabled': this.props.disabled,
      },
      className,
    );

    return (
      <div
        className={classes}
        onClick={this.handleClick}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
      >
        <div className="react-toggle-track">
          <div className="react-toggle-track-check">
            {this.getIcon('checked')}
          </div>
          <div className="react-toggle-track-x">
            {this.getIcon('unchecked')}
          </div>
        </div>
        <div className="react-toggle-thumb" />

        <input
          {...inputProps}
          ref={ref => {
            this.input = ref;
          }}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          className="react-toggle-screenreader-only"
          type="checkbox"
        />
      </div>
    );
  }
}

Toggle.displayName = 'Toggle';
