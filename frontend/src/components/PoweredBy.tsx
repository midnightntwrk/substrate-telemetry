// Powered by Shielded badge component

import * as React from 'react';
import { Icon } from './Icon';
import shieldedLogo from '../icons/shielded-logo.svg';
import './PoweredBy.css';

export const PoweredBy: React.FC = () => (
  <a
    className="PoweredBy"
    href="https://www.shielded.io/"
    target="_blank"
    rel="noopener noreferrer"
    title="Powered by Shielded Technologies"
  >
    <Icon src={shieldedLogo} className="PoweredBy-logo" />
    <span className="PoweredBy-text">
      Powered by <strong>Shielded</strong>
    </span>
  </a>
);
