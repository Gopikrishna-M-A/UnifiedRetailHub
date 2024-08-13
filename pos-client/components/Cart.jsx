"use client";
import { useEffect, useState, useRef} from "react";
import { useCart } from "../contexts/cartContext";
import CartProduct from "./CartProduct";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Bill from "./Bill";

const Cart = () => {
  const {
    cart,
    setCart,
    clearCart,
    HoldCart,
    setCustomer,
    removeCustomer,
    removeFromCart,
    removeOneFromCart,
    getAllCartsFromLocalStorage,
  } = useCart();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [localCarts, setLocalCarts] = useState([]);
  const [selectedCart, setSelectedCart] = useState(null);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [billOpen,setBillOpen] = useState(false)
  const [received, setReceived] = useState(0);
  const [newUser,setNewUser] = useState(false)
  const [order,setOrder] = useState()
  const [print,setPrint] = useState(false)
  const billRef = useRef(null);

  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);

  const handlePrint = () => {
    if (!billRef.current) return;
    
    html2canvas(billRef.current).then((canvas) => {
      // Convert the canvas to a Blob
      canvas.toBlob((blob) => {
        // Use file-saver to save the image
        saveAs(blob, `bill_${order.orderNumber}.png`);
      });

      // Open a new window with the image for printing
      const imgData = canvas.toDataURL('image/png');
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Bill</title>
          </head>
          <body style="margin:0;padding:0;">
            <img src="${imgData}" onload="window.print();window.close()" />
          </body>
        </html>
      `);
      printWindow.document.close();
    });
  };


  useEffect(() => {
    updateCart();
  }, [cart]);


  const updateCart = () => {
    const uniqueProducts = cart.products.reduce(
      (accumulator, currentProduct) => {
        const existingProduct = accumulator.find(
          (item) => item.product._id === currentProduct._id
        );

        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          accumulator.push({ product: currentProduct, quantity: 1 });
        }

        return accumulator;
      },
      []
    );
    setProducts(uniqueProducts);
    setTotal(
      cart.products.reduce((total, product) => total + product.currentPrice, 0)
    );
    setLocalCarts(getAllCartsFromLocalStorage());
  };

  useEffect(() => {
    if(navigator.onLine){
      axios.get(`/api/customers`).then((res) => {
        const usersWithPhoneNumber = res.data.filter((user) => user?.phone);
        setUsers(usersWithPhoneNumber);
        localStorage.setItem("pos-users", JSON.stringify(usersWithPhoneNumber));
      });
    }else{
      const data = JSON.parse(localStorage.getItem("pos-users"));
      setUsers(data);
    }
   
  }, []);

  const formatPrice = (price) => {
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(price);
    return formattedPrice;
  };

  const handleCartChange = (event) => {
    // Add the selected cart to the current cart
    const newCart = localCarts.find((cart) => cart.key === selectedCart);
    setCart(newCart.cart);
    localStorage.removeItem(newCart.key);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
    const phoneNumber = event.target.value;
    const userWithPhoneNumber = users.find(
      (user) => user.phone === phoneNumber
    );

    if (userWithPhoneNumber) {
      setDefaultFormValues(userWithPhoneNumber);
      setNewUser(false)
    }else{
      setNewUser(true)
    }
  };

  const setDefaultFormValues = (user) => {
    const emailInput = document.querySelector('input[name="email"]');
    const addressInput = document.querySelector('input[name="address"]');
    const townInput = document.querySelector('input[name="town"]');
    const stateInput = document.querySelector('input[name="state"]');
    const pinInput = document.querySelector('input[name="pin"]');
    const idInput = document.querySelector('input[name="id"]');

    setName(user.name || "");
    if (emailInput) emailInput.value = user.email || "";
    if (addressInput) addressInput.value = user.address.street || "";
    if (townInput) townInput.value = user.address.city || "";
    if (stateInput) stateInput.value = user.address.state || "";
    if (pinInput) pinInput.value = user.address.zipCode || "";
    if (idInput) idInput.value = user._id || "";
  };

  const handleCustomer = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    const shippingAddress = {
        street: formObject.address,
        city: formObject.town,
        state: formObject.state,
        zipCode: formObject.pin,
        country: formObject.country,
    }
   

    console.log("email",formObject.email,"name",formObject.name,"phone",formObject.phone,"addr",shippingAddress);
    if (newUser) {
      axios.post(`/api/customers`, {
        email: formObject.email,
        name: formObject.name,
        phone: formObject.phone,
        address: shippingAddress,
        posUser: true,
      })
      .then((res) => {
        console.log("New user created:", res.data); // Logging the response data
        setCustomer(res.data);
      })
      .catch((err) => {
        console.error("Error creating new user:", err); // Logging the error
      });
    }else{
      setCustomer({ name: formObject.name, phone: formObject.phone, _id: formObject.id, address:shippingAddress});
    }
  };

  function formatDateTime(input) {
    // Remove "userCart_" prefix
    const timestamp = input.replace("posCart_", "");

    const dateTime = new Date(timestamp);

    // Get day, date, and time components
    const options = {
      weekday: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const formattedDateTime = new Intl.DateTimeFormat("en-US", options).format(
      dateTime
    );

    return formattedDateTime;
  }

  function convertProducts(products) {
    return products.map(product => ({
      product: product.product._id,  // Assuming each product has an '_id' property
      quantity: product.quantity,  // You can set the quantity based on your requirements
      price: product.product.currentPrice,
    }));
  }


  const handleTender = async (method) => {
    try {
      const payment = {
        customer: cart.customer._id,
        products: convertProducts(products),
        totalAmount: total,
        shippingAddress: cart.customer.address,
        paymentStatus: "Paid",
        method,
        DeliverType: "Delivery",
      };
  
      const res = await axios.post(`/api/orders/pos-order`, payment);
      console.log('data from pos', res.data);
      
      setOrder(res.data);
      setBillOpen(true);
      clearCart();
      setName(null);
      setPhone(null);
      
      toast.success("Tender successfully processed.", {
        position: "top-right",
      });
    } catch (error) {
      console.error('Error processing tender:', error);
      toast.error("Failed to process tender. Please try again.", {
        position: "top-right",
      });
    }
  };

  return (
    <div className=" w-[38%] h-screen-lg  border- overflow-hidden relative text-muted-foreground">
      <div className="h-14 border-b flex justify-between px-5 items-center">
        <div>Cart</div>
        <div className="flex gap-5">
          <div
            onClick={() => {
              clearCart();
              setName(null);
              setPhone(null);
            }}
            className="flex flex-col items-center text-xs cursor-pointer hover:text-gray-500"
          >
            <span className="material-symbols-outlined">mop</span>
            Clean cart
          </div>

          <div
            onClick={() => {
              if (cart.customer) {
                HoldCart();
                setName(null);
                setPhone(null);
              } else {
                setOpen(true);
              }
            }}
            className="flex flex-col items-center text-xs cursor-pointer hover:text-gray-500"
          >
            <span className="material-symbols-outlined">back_hand</span>
            Hold
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <div className="flex flex-col items-center text-xs cursor-pointer hover:text-gray-500">
                <span className="material-symbols-outlined">group_add</span>
                Customer
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Customer</DialogTitle>
                <DialogDescription>
                  <form
                    className="flex flex-col gap-5 mt-5"
                    onSubmit={handleCustomer}
                  >
                    <div className="flex gap-5">
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        name="name"
                        placeholder="Customer Name"
                      />
                      <Input
                        value={phone}
                        onChange={handlePhoneChange}
                        name="phone"
                        placeholder="Mobile Number"
                      />
                    </div>
                    <div className="flex gap-5">
                      <Input name="email" placeholder="Email" />
                      <Input name="address" placeholder="Address" />
                    </div>
                    <div className="flex gap-5">
                      <Input name="town" placeholder="Town/City" />
                      <Input name="state" placeholder="State" />
                      <Input name="pin" placeholder="Postal Code" />
                    </div>
                    <Input type="hidden" name="country" value="India" />
                    <Input type="hidden" name="id"  />

                    <DialogClose asChild>
                      <Button disabled={!(phone && name)} type="submit">
                        Add
                      </Button>
                    </DialogClose>
                  </form>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger>
              <div className="flex flex-col items-center text-xs cursor-pointer hover:text-gray-500">
                <span className="material-symbols-outlined">history</span>
                Recall Bill
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>List of held carts</DialogTitle>
                <DialogDescription>
                  {localCarts.length === 0 ? (
                    "No held carts"
                  ) : (
                    <table className="w-full">
                      <thead className="w-full">
                        <tr className=" w-full">
                          <th className="text-left">Held date</th>
                          <th className="text-left">Customer</th>
                          <th className="text-center">Total Items</th>
                          <th className="text-right">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {localCarts.map((item, index) => (
                          <tr
                            onClick={() => setSelectedCart(item.key)}
                            key={index}
                            className={`hover:bg-blue-50  dark:hover:bg-gray-800 cursor-pointer transition-all ${
                              item.key == selectedCart &&
                              "bg-blue-200  dark:bg-gray-900 text-gray-500"
                            }`}
                          >
                            <td className="text-left">
                              {formatDateTime(item.key)}
                            </td>
                            <td className="text-left">
                              {item?.cart?.customer?.name}
                            </td>
                            <td className="text-center">
                              {item?.cart?.products?.length}
                            </td>
                            <td className="text-right">
                              {formatPrice(
                                item.cart.products.reduce(
                                  (total, product) => total + product.currentPrice,
                                  0
                                )
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button
                    disabled={!selectedCart}
                    type="button"
                    onClick={handleCartChange}
                  >
                    Add
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>



          <Dialog open={billOpen} onOpenChange={setBillOpen}>
            <DialogContent className='h-[700px] overflow-scroll' >
              <DialogHeader>
                <DialogDescription>
                  <div className=" w-full flex justify-center items-center ">
                      <Bill order={order} ref={billRef}/>
                  </div>
                    <DialogClose asChild className="">
                      <Button className="mt-5 float-right" onClick={handlePrint}>
                        Print
                      </Button>
                    </DialogClose>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          

          {/* <div className="flex items-center text-xs cursor-pointer hover:text-gray-500">
            <span className="material-symbols-outlined">more_horiz</span>
          </div> */}
        </div>
      </div>
      <div className="w-full overflow-y-scroll h-full pb-56">
        {cart.customer && (
          <div className="bg-blue-100 dark:bg-gray-900 flex justify-between items-center px-5 py-2 text-sm">
            <div className="flex gap-1 items-center">
              <div className="text-blue-500">{cart.customer.name}</div>
              <div className="text-gray-500">|</div>
              <div className="text-gray-500">{cart.customer.phone}</div>
            </div>
            <svg
              onClick={removeCustomer}
              className="hover:text-gray-500 cursor-pointer"
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
        )}

        {products.map((product, index) => (
          <div
            className="cursor-pointer select-none hover:bg-blue-50 dark:hover:bg-gray-900 transition-all"
            onClick={(e) => {
              if (e.detail >= 2) {
                removeOneFromCart(product.product._id);
              }
            }}
          >
            <CartProduct
              key={product.product._id}
              product={product}
              index={index}
            />
          </div>
        ))}
      </div>

      <div className="h-40 flex flex-col gap-2 bg-white dark:bg-gray-950 items-start p-5 w-full border-t absolute bottom-0 left-0 right-0">
        <div className="flex justify-between w-full">
          <div className="flex gap-2 items-center">
            <div className="text-lg font-medium">Total</div>
            <div className="text-xs">{`(items:${products.length}, Quantity: ${cart.products.length})`}</div>
          </div>
          <div className="text-lg font-bol">
            {formatPrice(total)}
          </div>
        </div>

        <div className="flex w-full justify-between">
          <Dialog onOpenChange={()=>setReceived(0)} >
            <DialogTrigger asChild>
              <Button variant="outline">Cash[F1]</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cash</DialogTitle>
                <DialogDescription>
                    <div className="flex flex-col gap-3 mt-2">
                        <div className="flex">
                            <div className=" w-2/5">Total Amount</div>
                            <div className="w-3/5">{formatPrice(total)}</div>
                        </div>
                        <div className="flex">
                            <div className="w-2/5">Amount Received</div>
                            <div className="w-3/5">
                            <Input type="number" value={received} onChange={(e)=>setReceived(e.target.value)}/>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    <Button onClick={()=>{setReceived((prev)=>parseInt(prev)+50)}} variant="outline">{formatPrice(50)}</Button>
                                    <Button onClick={()=>{setReceived((prev)=>parseInt(prev)+60)}} variant="outline">{formatPrice(60)}</Button>
                                    <Button onClick={()=>{setReceived((prev)=>parseInt(prev)+100)}} variant="outline">{formatPrice(100)}</Button>
                                    <Button onClick={()=>{setReceived((prev)=>parseInt(prev)+200)}} variant="outline">{formatPrice(200)}</Button>
                                    <Button onClick={()=>{setReceived((prev)=>parseInt(prev)+500)}} variant="outline">{formatPrice(500)}</Button>
                                    <Button onClick={()=>{setReceived((prev)=>parseInt(prev)+2000)}} variant="outline">{formatPrice(2000)}</Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-2/5">Note</div>
                            <Input className="w-3/5"/>
                        </div>
                        <div className="flex">
                            <div className="w-2/5">Change to be given</div>
                            <div className="w-3/5">{formatPrice(received-total > 0 ? received-total : 0)}</div>
                        </div>
                    </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button onClick={()=>handleTender("cash")}>Tender</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog >
            <DialogTrigger asChild>
              <Button variant="outline">Card[F2]</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Card</DialogTitle>
                <DialogDescription>
                <div className="flex justify-center items-center">
                            <div className="w-2/5">Reference Number / Id</div>
                            <Input className="w-3/5"/>
                        </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button onClick={()=>handleTender("card")}>Tender</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog >
            <DialogTrigger asChild>
              <Button variant="outline">Upi[F3]</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upi</DialogTitle>
                <DialogDescription>
                <div className="flex justify-center items-center">
                            <div className="w-2/5">Reference Number / Id</div>
                            <Input className="w-3/5"/>
                        </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button onClick={()=>handleTender("Upi")}>Tender</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog >
            <DialogTrigger asChild>
              <Button variant="outline">Credit sale[F4]</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Credit sale</DialogTitle>
                <DialogDescription>
                <div className="flex justify-center items-center">
                            <div className="w-2/5">Reference Number / Id</div>
                            <Input className="w-3/5"/>
                        </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button onClick={()=>handleTender("credit")}>Tender</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="w-full">
          <Dialog >
            <DialogTrigger asChild>
              <Button className="w-full" variant="outline">
                Split Payment[F12]
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Split Payment</DialogTitle>
                <DialogDescription>Currently Unavailable</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Cart;
