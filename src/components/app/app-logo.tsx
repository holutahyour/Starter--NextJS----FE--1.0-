import Image from "next/image";

function AppLogo() {
    return (
        <a href="#" className="flex p-2">
            <Image
                src={"/assets/images/logo.png"}
                alt="logo"
                height={80} // Increased height
                width={100.5} // Proportionally increased width (original was 86.9 for height 55)
                className="mx-auto"
            />
        </a>
    );
}

export default AppLogo;
