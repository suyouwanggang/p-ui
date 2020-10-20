import {css} from 'lit-element'; export default css`:host {
  display: block; }

.trigger-status {
  display: inline-block;
  position: relative;
  padding-right: 3px;
  padding-left: 3px;
  font-size: 10px;
  cursor: pointer; }

.trigger-status[empty] {
  cursor: default;
  opacity: 0; }

.node_icon {
  position: relative;
  vertical-align: middle;
  top: var(--node-icon-top, 0);
  color: var(--node-icon-color, inherit); }

.node_div {
  display: block;
  height: var(--p-tree-nodeHeight, 1.6em);
  margin: 5px 0; }

.node_div:hover::before {
  z-index: -1;
  background: #e6f7ff;
  content: '';
  left: 0;
  right: 0;
  position: absolute;
  height: inherit; }

.node_container {
  line-height: var(--node-text-line-height, 1.6em);
  white-space: nowrap; }

.node_child {
  display: inherit;
  padding-left: 0.9em; }

.node_container[closed] > .node_child {
  display: none; }
`; 