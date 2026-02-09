import { Container } from "@/components/index";
import { Link } from "react-router-dom";
import { LaptopMinimal } from "lucide-react";
import { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

const Footer = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Błąd pobierania kategorii:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <footer>
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
              <ul className="flex flex-wrap items-center gap-4">
                {categories.map(({ name, slug }: Category, index: number) => (
                  <li
                    key={index}
                    className={`text-sm duration-200 hover:text-blue-500 md:text-base`}
                  >
                    <Link to={slug}>{name}</Link>
                  </li>
                ))}
              </ul>
            </section>
            <section className="text-sm leading-6 md:text-base md:leading-8">
              Sklep internetowy utworzony przez w celu zaliczenia przedmiotu
              Aplikacje Internetowe. Autorzy: Kacper Kowalski i Jakub Kwaśniak.
            </section>
          </div>
        </section>
      </Container>
    </footer>
  );
};

export default Footer;
