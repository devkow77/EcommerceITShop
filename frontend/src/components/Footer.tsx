import { Container } from "@/components/index";
import { Link } from "react-router-dom";
import { LaptopMinimal } from "lucide-react";

interface NavLink {
  name: string;
  href: string;
}

const links: NavLink[] = [
  {
    name: "Strona główna",
    href: "/",
  },
  {
    name: "Akcesoria",
    href: "/products/akcesoria",
  },
  {
    name: "Laptopy",
    href: "/products/laptopy",
  },
  {
    name: "Smartwatche",
    href: "/products/smartwatche",
  },
  {
    name: "Słuchawki",
    href: "/products/sluchawki",
  },
  {
    name: "Laptopy",
    href: "/products/laptopy",
  },
  {
    name: "Telefony",
    href: "/products/telefony",
  },
];

const Footer = () => {
  return (
    <footer className="mt-8">
      <Container>
        <section className="border-t border-neutral-300 py-8 dark:border-neutral-700">
          <div className="grid grid-cols-1 gap-6">
            <section className="space-y-2">
              <Link to="/" className="flex gap-2 font-bold">
                <LaptopMinimal />
                <h1>IT Shop</h1>
              </Link>
              <p className="text-sm leading-6 md:text-base md:leading-8 dark:opacity-80">
                Sklep internetowy posiadający szeroki asortyment urządzeń
                elektronicznych do twojego domu.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="font-semibold">Linki</h2>
              <ul className="flex items-center gap-4">
                {links.map(({ name, href }: NavLink, index: number) => (
                  <li
                    key={index}
                    className={`text-sm duration-200 md:text-base`}
                  >
                    <Link to={href}>{name}</Link>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              Sklep internetowy utworzony przez w celu zaliczenia przedmiotu
              Aplikacje Internetowe. Autorzy: Kacper Kowalski, Jakub
              Kwaśniak.{" "}
            </section>
          </div>
        </section>
      </Container>
    </footer>
  );
};

export default Footer;
