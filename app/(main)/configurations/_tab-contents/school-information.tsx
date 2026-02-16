import apiHandler from "@/data/api/ApiHandler";
import Image from "next/image";

function SchoolInformation() {
  const SchoolInformation = {
    name: "",
    address: "",
    address2: "",
    city: "",
    stateName: "",
    countryName: "",
    phoneNumber: "",
    email: "",
    logo: "",
    logoUrl: "",
    addressProof: "",
    addressProofUrl: "",
    briefDescription: "",
    twitter: "",
    website: "",
    postalCode: "",
    facebook: "",
    stateCode: "", // Added missing property
    countryCode: "", // Added missing property
  };

  const data = SchoolInformation;
  return (
    <div>
      <div className="flex flex-col justify-between mr-[19.1rem] relative">
        <div className="flex  justify-between mr-[19.1rem]">
          <div className="flex flex-col gap-[0.1rem]">
            <p className="text-[2.4rem] text-black-100">{data?.name}</p>
            <p className="text-[1.8rem] text-bodyText-100">{`${data?.address2} ${data?.address} ${data?.city} ${data?.stateName} ${data?.countryName}`}</p>
          </div>
          <div className="flex flex-col gap-[1.1rem]">
            <div className="flex space-x-[1.1rem]">
              <div className="w-[3.2rem] h-[2.8rem] bg-lightColor-100 flex justify-center items-center">
                <Image
                  src={"/assets/icons/phone-icon.svg"}
                  alt="phone picture"
                  width={20}
                  height={20}
                />
              </div>
              <p className="text-bodyText-100 text-[1.8rem]">
                {data?.phoneNumber}
              </p>
            </div>
            <div className="flex space-x-[1.1rem]">
              <div className="w-[3.2rem] h-[2.8rem] bg-lightColor-100 flex justify-center items-center">
                <Image
                  src={"/assets/icons/message-icon.svg"}
                  alt="mail picture"
                  width={20}
                  height={20}
                />
              </div>
              <p className="text-bodyText-100 text-[1.8rem]">{data?.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-[4.9rem] mb-[6.4rem]">
          <p className="font-semibold text-[2rem] text-black-100">
            Description:{" "}
          </p>
          <p className="font-medium text-grey-100 w-full">
            {data?.briefDescription}
          </p>
        </div>

        <div className="font-semibold text-[2rem] text-black-100 mb-[6.4rem]">
          <p className="font-semibold text-[2rem] text-black-100">Images </p>
          <div className="flex space-x-2">
            <Image
              src={"/assets/images/image1.svg"}
              alt="school picture"
              width={161}
              height={150.027}
              className="w-[16.1rem] h-[15.027rem] "
            />
            <Image
              src={"/assets/images/image2.svg"}
              alt="school picture"
              width={161}
              height={150.027}
              className="w-[16.1rem] h-[15.027rem] "
            />
            <Image
              src={"/assets/images/image3.svg"}
              alt="school picture"
              width={161}
              height={150.027}
              className="w-[16.1rem] h-[15.027rem] "
            />
          </div>
        </div>
        <div className="">
          <p className="font-semibold text-[2rem] text-black-100">Socials </p>
          <div className="flex space-x-2">
            <div className="w-[3.2rem] h-[2.8rem] bg-lightColor-100 flex justify-center items-center">
              <a href={data?.facebook} target="_blank">
                <Image
                  src={"/assets/icons/facebook-icon.svg"}
                  alt="facebook picture"
                  width={8.46}
                  height={15.21}
                />
              </a>
            </div>
            <div className="w-[3.2rem] h-[2.8rem] bg-lightColor-100 flex justify-center items-center">
              <a href={data?.twitter} target="_blank">
                <Image
                  src={"/assets/icons/twitter-icon.svg"}
                  alt="x "
                  width={15.98}
                  height={15.63}
                />
              </a>
            </div>
            <div className="w-[3.2rem] h-[2.8rem] bg-lightColor-100 flex justify-center items-center">
              <a href={data?.website} target="_blank">
                <Image
                  src={"/assets/icons/web-icon.svg"}
                  alt="web"
                  width={19.92}
                  height={20}
                />
              </a>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="w-[6.5rem] h-[6.5rem] 2xl:w-[7.5rem] 2xl:h-[7.5rem] bg-primary flex items-center justify-center rounded-[50%] absolute right-[0rem] bottom-[-2rem] 2xl:bottom-[-13rem] z-20"></div>
        </div>
      </div>
    </div>
  );
}

export default SchoolInformation;
