/* eslint-disable react-dom/no-unsafe-target-blank */
import Image from 'next/image';

import { LogoCloud } from '@/features/landing/LogoCloud';

export const SponsorLogos = () => (
  <LogoCloud text="Strategic Partners">
    <a
      href="https://www.nicusa.com"
      target="_blank"
      rel="noopener"
    >
      <Image
        src="/assets/images/nic-logo.jpg"
        alt="NIC National Interoperability Collaborative"
        width="180"
        height="60"
      />
    </a>

    <a
      href="https://www.bronxrhio.org"
      target="_blank"
      rel="noopener"
    >
      <Image
        src="/assets/images/bronxrhio-logo.jpg"
        alt="BronxRHIO"
        width="180"
        height="60"
      />
    </a>

    <a
      href="https://stewardsofchange.com"
      target="_blank"
      rel="noopener"
    >
      <Image
        src="/assets/images/stewards-logo.jpg"
        alt="Stewards of Change Institute"
        width="180"
        height="60"
      />
    </a>
  </LogoCloud>
);
