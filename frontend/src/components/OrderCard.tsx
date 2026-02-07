import { ChevronDown, ChevronUp } from "lucide-react";
import CancelOrderDialog from "@/components/CancelOrderDialog";

interface OrderItemType {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    slug: string;
  };
}

interface OrderType {
  id: number;
  userId: number;
  totalAmount: number;
  status: "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELED";
  createdAt: string;
  items: OrderItemType[];
}

interface OrderCardProps {
  order: OrderType;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onOrderCanceled?: () => void;
}

const OrderCard = ({
  order,
  isExpanded,
  onToggleExpand,
  onOrderCanceled,
}: OrderCardProps) => {
  const getStatusBadgeColor = (
    status: "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELED",
  ) => {
    const colors: { [key: string]: string } = {
      PENDING:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      PAID: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      SHIPPED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      COMPLETED:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      CANCELED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[status] || "";
  };

  const getStatusLabel = (status: string): string => {
    const labels: { [key: string]: string } = {
      PENDING: "Oczekujące",
      PAID: "Zapłacone",
      SHIPPED: "Wysłane",
      COMPLETED: "Ukończone",
      CANCELED: "Anulowane",
    };
    return labels[status] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div
        onClick={onToggleExpand}
        className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Zamówienie #{order.id}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeColor(order.status)}`}
            >
              {getStatusLabel(order.status)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold text-gray-900 dark:text-white">
              {(order.totalAmount / 100).toFixed(2)} zł
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {order.items.length} przedmiot
              {order.items.length !== 1 ? "ów" : ""}
            </p>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          {/* Order Items */}
          <div className="mb-6 space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Przedmioty
            </h4>
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
              >
                {/* Product Image */}
                <div className="h-20 w-20 flex-shrink-0">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="h-full w-full rounded object-cover"
                  />
                </div>
                {/* Product Details */}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ilość: {item.quantity}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Cena za sztukę: {(item.price / 100).toFixed(2)} zł
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Razem: {((item.price * item.quantity) / 100).toFixed(2)} zł
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mb-6 border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="flex justify-end gap-12">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Razem:
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {(order.totalAmount / 100).toFixed(2)} zł
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {order.status === "PENDING" && (
            <div className="flex gap-2">
              <CancelOrderDialog
                orderId={order.id}
                onSuccess={onOrderCanceled || (() => {})}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
