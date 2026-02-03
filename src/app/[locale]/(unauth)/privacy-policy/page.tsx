import { unstable_setRequestLocale } from 'next-intl/server';

import { Footer } from '@/templates/Footer';
import { Navbar } from '@/templates/Navbar';

export async function generateMetadata() {
  return {
    title: 'Privacy Policy - AlignHealthcareAI',
    description: 'Privacy Policy for AlignHealthcareAI and Open City Labs',
  };
}

const PrivacyPolicyPage = (props: { params: { locale: string } }) => {
  unstable_setRequestLocale(props.params.locale);

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>

        <section className="mb-8">
          <p className="mb-4 text-muted-foreground">
            Open City Labs, Inc. ("Open City Labs") provides a hotline for members of the public to report potential compliance concerns. If you would like to raise a compliance-related concern, please dial 1 (802) 489-6737.
          </p>
          <p className="mb-4 text-muted-foreground">
            <strong>Last Updated: December 18, 2022</strong>
          </p>
          <p className="mb-4 text-muted-foreground">
            We take your privacy seriously. This policy is about how we keep your information safe while helping you get connected to services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Who are we?</h2>
          <p className="mb-4 text-muted-foreground">
            Open City Labs connects people to health and social care providers and to the data they need to improve health and well-being. We are a mission driven organization committed to empowering people to live their most healthy and fulfilling lives by enabling services to be universally accessible, individually personalized and one click away.
          </p>
          <p className="mb-4 text-muted-foreground">
            Our platform can help you access healthcare and social services provided by a group of practitioners and organizations that we call your Care Team.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Who is part of your Care Team?</h2>
          <p className="mb-4 text-muted-foreground">
            Open City Labs works with healthcare providers that include, but are not limited to (hospitals, federally qualified community health centers, visiting nurses, health insurance plans, health information exchanges) and social care providers that include, but are not limited to (food pantries, educational institutions, homeless shelters) and government agencies to get you connected to services and connect practitioners of those organizations to the data and technology they need to deliver the best care. Your Care Team are the people and organizations who provide care to the you and your community.
          </p>
          <p className="mb-4 text-muted-foreground">
            Network Participants offer several services, such as clothing and household goods, mental or behavioral health treatment, veteran services, and financial assistance.
          </p>
          <p className="mb-4 text-muted-foreground">
            The Network Participants are here to help you no matter your needs. Our tool allows them to come together to better serve you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">How do you get my information?</h2>
          <p className="mb-4 text-muted-foreground">
            We are a technology company that helps your Care Team coordinate care for you. We receive information directly from the Care Team so that we can all better serve you. You may also provide your information through our online forms. We also receive information from publicly available sources.
          </p>
          <p className="mb-4 text-muted-foreground">
            No matter the source of information, Open City Labs is strongly committed to protecting your personal information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">What type of information do you collect?</h2>
          <p className="mb-4 text-muted-foreground">
            The only information required to get you help through Open City Labs is your name and date of birth and address. You may share other details about yourself, such as household information, contact information for you or your family, age, race, gender identity, tribal affiliation, and military service. You always decide what information you want to share.
          </p>
          <p className="mb-4 text-muted-foreground">
            Network Participants or your Care Team may require more information to confirm your care needs and eligibility. Examples include:
          </p>
          <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">
            <li>Healthcare conditions and insurance benefits</li>
            <li>Financial information and job status</li>
            <li>Housing status</li>
            <li>Government benefit status</li>
            <li>and other information needed to connect you with services.</li>
          </ul>
          <p className="mb-4 text-muted-foreground">
            Some details you provide may be a special type of information called "protected health information" or "personal information" under federal or state laws. We have built our technology to limit who can view your information and prevent inappropriate access to your information. To protect your confidentiality, we can track who provided your information, who accessed it, and whether it has been shared with other Network Participants or your Care Team.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">How may Open City Labs use or share my information?</h2>
          <p className="mb-4 text-muted-foreground">
            We only use or share your information as described in this privacy policy or as required by law. Here are a few examples of how your information may be used or shared:
          </p>
          <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">
            <li>
              <strong>To contact you, a family member, or caregiver:</strong>
              {' '}
              You may be asked to share contact information for yourself, or others involved in your care, like a family member or an aide. Open City Labs and Network Participants may call, text, or email to help connect you with services, understand your needs, or update you about your care. You will only be contacted if you agree, and we are allowed to do so.
            </li>
            <li>
              <strong>For referrals for treatment, care coordination, care management and case management:</strong>
              {' '}
              Open City Labs and Network Participants may use or share your information to get you the health and social care you need. This includes coordinating your care, managing your case, and evaluating the impact of Network Participant services and the Network.
            </li>
            <li>
              <strong>For qualification for benefits:</strong>
              {' '}
              Your information may be used to see if you are eligible for any government or private benefits or programs.
            </li>
            <li>
              <strong>For payment of services:</strong>
              {' '}
              Open City Labs and Network Participants may share your information with government agencies or other providers and organizations paying for services.
            </li>
            <li>
              <strong>For business operations:</strong>
              {' '}
              Open City Labs may use and share your information for our business operations. Open City Labs may also use your information to improve our products and investigate any complaints. Additionally, to keep the Network running, Open City Labs may share your information with our service providers, such as technology, accounting, legal, and research services. Our service providers are required to keep your information safe and follow privacy laws, just like we do.
            </li>
            <li>
              <strong>Marketing:</strong>
              {' '}
              Open City Labs will not use your information for marketing purposes unless you expressly agree to receive marketing communications.
            </li>
            <li>
              <strong>If required by law:</strong>
              {' '}
              Open City Labs may be required to share your information if required by law. This could include responding to a regulatory agency, or to satisfy a subpoena or similar legal process. If any information is required to be released by law, Open City Labs will take appropriate legal action to protect the information.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Non-Personal Information We Collect Automatically</h2>
          <p className="mb-4 text-muted-foreground">
            We may automatically collect the following information about your use of our Site or Services through cookies, web beacons, and other technologies: your domain name; your browser type and operating system; web pages you view; links you click; your IP address; the length of time you visit our Site or use our Services; and the referring URL, or the webpage that led you to our Site, and the following: access time, browser type, device ID, domain name, IP address, page views and referring URL. We also may collect the following information about your use of the Application: mobile device ID; location and language information; device name and model; operating system type, name, and version; your activities within the Application; and the length of time that you are logged into our Application. We may combine this information with other information that we have collected about you, including, where applicable, your username, name, and other personal information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Our Use of Cookies and Other Tracking Mechanisms</h2>
          <p className="mb-4 text-muted-foreground">
            We and our third-party service providers use cookies and other tracking mechanisms to track information about your use of our Site or Services. We may combine this information with other personal information we collect from you (and our third-party service providers may do so on our behalf).
          </p>
          <p className="mb-4 text-muted-foreground">
            Currently, our systems do not recognize browser "do-not-track" requests. You may, however, disable certain tracking as discussed in this section (e.g., by disabling cookies); you also may opt-out of targeted advertising by following the instructions in the Third-Party Ad Network section.
          </p>

          <h3 className="mb-3 mt-6 text-xl font-semibold">Cookies</h3>
          <p className="mb-4 text-muted-foreground">
            Cookies are alphanumeric identifiers that we transfer to your computer's hard drive through your web browser for record-keeping purposes. Some cookies allow us to make it easier for you to navigate our Site and Services, while others are used to enable a faster log-in process or to allow us to track your activities at our Site and Service. There are two types of cookies: session and persistent cookies.
          </p>

          <h4 className="mb-2 mt-4 text-lg font-semibold">Session Cookies</h4>
          <p className="mb-4 text-muted-foreground">
            Session cookies exist only during an online session. They disappear from your computer when you close your browser or turn off your computer. We use session cookies to allow our systems to uniquely identify you during a session or while you are logged into the Site. This allows us to process your online transactions and requests and verify your identity, after you have logged in, as you move through our Site.
          </p>

          <h4 className="mb-2 mt-4 text-lg font-semibold">Persistent Cookies</h4>
          <p className="mb-4 text-muted-foreground">
            Persistent cookies remain on your computer after you have closed your browser or turned off your computer. We do not currently use persistent cookies on the Site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Security of Personal Information</h2>
          <p className="mb-4 text-muted-foreground">
            We use reasonable administrative, technical, and physical measures to protect Personal Information under our control, and Protected Health Information is specifically per the HIPAA rules. Unfortunately, no data transmission over the Internet or data storage system can be guaranteed to be 100% secure. If you have reason to believe that your interaction with us is no longer secure (for example, if you feel that the security of any account you might have with us has been compromised), please immediately notify us of the problem by contacting us at legal@opencitylabs.com.
          </p>
          <p className="mb-4 text-muted-foreground">
            You should take steps to protect against unauthorized access to your password, phone, and computer by, among other things, signing off after using a shared computer, choosing a robust password that nobody else knows or can easily guess, and keeping your log-in and password private. We are not responsible for any lost, stolen, or compromised passwords or for any activity on your account via unauthorized password activity.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">What about my sensitive information?</h2>
          <p className="mb-4 text-muted-foreground">
            Our technology enables care coordination while protecting sensitive information. We have built protections to limit the visibility of sensitive information. This includes referrals and services that are related to substance use and subject to 42 CFR Part 2, HIV/AIDS support, and other information protected under federal and/or state privacy laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Special Notice to California Residents</h2>
          <p className="mb-4 text-muted-foreground">
            This section applies only to those living in California and describes additional rights available to them.
          </p>
          <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">
            <li>You have the right to ask us to delete your information from our records. We may keep information if we or our Network Participants are required to do so by law.</li>
            <li>You have the right to request a copy of the information collected about you.</li>
            <li>You have the right to request whether your information was sold or shared.</li>
          </ul>
          <p className="mb-4 text-muted-foreground">
            We may ask you to verify your identity if you make these requests. We will not discriminate against you for making these requests.
          </p>
          <p className="mb-4 text-muted-foreground">
            These rights do not apply to information covered by HIPAA or the California Confidentiality of Medical Information Act. They also do not apply to publicly available information from government records, de-identified or aggregated information, or personal information covered by other privacy laws. We do not sell personal information as it is described under the California Consumer Protection Act.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">General Information</h2>

          <h3 className="mb-3 mt-6 text-xl font-semibold">Requests</h3>
          <p className="mb-4 text-muted-foreground">
            Please submit all requests, complaints, and concerns in writing to compliance@opencitylabs.com or through our toll-free number at (800) 461-9330. If you no longer want your information shared on the Network or if you want to request removal of your personal information, you can email consent@opencitylabs.com.
          </p>

          <h3 className="mb-3 mt-6 text-xl font-semibold">Changes to this policy</h3>
          <p className="mb-4 text-muted-foreground">
            Open City Labs reserves the right to change this policy at any time and will post any changes to this website.
          </p>

          <h3 className="mb-3 mt-6 text-xl font-semibold">Translations</h3>
          <p className="mb-4 text-muted-foreground">
            We have this policy available in languages other than English. The translated versions are provided for convenience and do not change the English version.
          </p>

          <h3 className="mb-3 mt-6 text-xl font-semibold">Notice to website users located outside the U.S.</h3>
          <p className="mb-4 text-muted-foreground">
            Open City Labs operates in accordance with the laws of the U.S. When you access our website from outside the U.S., we may transfer the personal information that we collect from you to a location outside of your jurisdiction, including the U.S. The data protection laws in these jurisdictions may not provide you with the same protections as those of your jurisdiction. By using this website, you acknowledge that these laws may provide a different standard of protection, and you consent to the transfer of your personal data to other jurisdictions, including the U.S.
          </p>

          <h3 className="mb-3 mt-6 text-xl font-semibold">Children</h3>
          <p className="mb-4 text-muted-foreground">
            Open City Labs is intended for a general audience and is not directed at children under 13 years of age. If you are a parent or guardian and you believe we have collected information from your child in a manner not permitted by law, please contact us at compliance@opencitylabs.com.
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;
