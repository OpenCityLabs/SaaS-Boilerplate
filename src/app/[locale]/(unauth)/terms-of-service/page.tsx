import { Footer } from '@/templates/Footer';
import { Navbar } from '@/templates/Navbar';

export async function generateMetadata() {
  return {
    title: 'Terms of Service - AlignHealthcareAI',
    description: 'Terms and Conditions of Use for AlignHealthcareAI',
  };
}

const TermsOfServicePage = () => {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="mb-8 text-4xl font-bold">Terms and Conditions</h1>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Terms</h2>
          <p className="mb-4 text-muted-foreground">
            By accessing this web site, you are agreeing to be bound by these web site Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this web site are protected by applicable copyright and trade mark law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Use License</h2>
          <p className="mb-4 text-muted-foreground">
            Permission is granted to temporarily download one copy of the materials (information or software) on Open City Labs' web site for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>attempt to decompile or reverse engineer any software contained on Open City Labs' web site;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or 'mirror' the materials on any other server.</li>
          </ul>
          <p className="mb-4 text-muted-foreground">
            This license shall automatically terminate if you violate any of these restrictions and may be terminated by Open City Labs at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Disclaimer</h2>
          <p className="mb-4 text-muted-foreground">
            The materials on Open City Labs' web site are provided 'as is.' Open City Labs makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, Open City Labs does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its Internet web site or otherwise relating to such materials or on any sites linked to this site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Limitations</h2>
          <p className="mb-4 text-muted-foreground">
            In no event shall Open City Labs or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption,) arising out of the use or inability to use the materials on Open City Labs' Internet site, even if Open City Labs or a Open City Labs authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Revisions and Errata</h2>
          <p className="mb-4 text-muted-foreground">
            The materials appearing on Open City Labs' web site could include technical, typographical, or photographic errors. Open City Labs does not warrant that any of the materials on its web site are accurate, complete, or current. Open City Labs may make changes to the materials contained on its web site at any time without notice. Open City Labs does not, however, make any commitment to update the materials.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Links</h2>
          <p className="mb-4 text-muted-foreground">
            Open City Labs has not reviewed all of the sites linked to its Internet web site and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Open City Labs of the site. Use of any such linked web site is at the user's own risk.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Site Terms of Use Modifications</h2>
          <p className="mb-4 text-muted-foreground">
            Open City Labs may revise these terms of use for its web site at any time without notice. By using this web site you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Governing Law</h2>
          <p className="mb-4 text-muted-foreground">
            Any claim relating to Open City Labs' web site shall be governed by the laws of the State of New York without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <p className="mb-4 text-muted-foreground">
            General Terms and Conditions applicable to Use of a Web Site.
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default TermsOfServicePage;
