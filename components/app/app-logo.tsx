import Image from "next/image";

function AppLogo() {
    return (
        <a href="#" className="flex p-2">
            <Image
                src={"/assets/images/logo.jpg"}
                alt="logo"
                height={60} // Increased height
                width={80.5} // Proportionally increased width (original was 86.9 for height 55)
                className="mx-auto"
            />
        </a>
    );
}

export default AppLogo;
