import axios from "axios";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase.init";
import { useUser } from "../../protectedRoutes";
import "./membership.css";

export default function Membership() {
  const userDetails = useUser();
  const baseurl = "https://monogram.onrender.com";
  // const baseurl = "http://localhost:4500";
  const key_sec = process.env.REACT_APP_RAZOR;
  const [user] = useAuthState(auth);
  const [selectedPlan, setSelectedPlan] = useState();
  const [currentPlan] = useState(userDetails.membership);

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  const handleMakeOrder = async (e) => {
    e.preventDefault();

    if (!selectedPlan) return;
    if (selectedPlan === "Basic") return;
    if (selectedPlan === currentPlan) return;

    try {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        console.log("Razorpay SDK failed to load. Are you online?");
        return;
      }

      let result = await axios.post(`${baseurl}/payment/order`, {
        plan: selectedPlan,
      });

      console.log("This is order result");
      console.log(result);

      const { amount, id: order_id, currency } = result.data;
      ///////////////////

      const options = {
        key: key_sec,
        amount: amount.toString(),
        currency: currency,
        name: "Monogram",
        description: "Test Transaction",
        image: "https://cdn-icons-png.flaticon.com/128/2111/2111463.png",
        order_id: order_id,
        handler: async function (response) {
          const data = {
            orderCreationId: order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            userEmail: user.email,
          };
          let successRes = await axios.post(
            `${baseurl}/payment/validate`,
            data
          );
          if (successRes) {
            alert("Payment Successful! membership is updated");
          } else {
            alert("Payment failed! try again later");
          }
        },
        prefill: {
          name: "Pranay",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        console.log(
          response.error.code,
          response.error.description,
          response.error.source,
          response.error.step,
          response.error.reason,
          response.error.metadata.order_id,
          response.error.metadata.payment_id
        );
      });
      rzp1.open();
      e.preventDefault();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className="d-flex flex-column align-items-center justify-content-center gap-2 w-100 h-100"
      onSubmit={handleMakeOrder}
    >
      <p className="fs-1">Memberships</p>
      {/* ////////////////////////// */}
      <div className="border w-50 rounded membershipcard-basic">
        <section className="p-3 d-flex rounded gap-2">
          <input
            className="form-check-input"
            type="radio"
            name="exampleRadios"
            id="exampleRadios1"
            value="Basic"
            checked={selectedPlan === "Basic" || currentPlan === "Basic"}
            onChange={(e) => setSelectedPlan(e.target.value)}
          />
          <label className="form-check-label" for="exampleRadios1">
            Free
            {currentPlan === "Basic" && " (Active)"}
          </label>
        </section>
        <ul>
          <li> 1 Post/day </li>
        </ul>
      </div>
      {/* ////////////////////////// */}
      <div className="border w-50 rounded membershipcard-silver">
        <section className="p-3 d-flex rounded gap-2">
          <input
            className="form-check-input"
            type="radio"
            name="exampleRadios"
            id="exampleRadios1"
            value="Silver"
            checked={selectedPlan === "Silver" || currentPlan === "Silver"}
            onChange={(e) => setSelectedPlan(e.target.value)}
          />
          <label className="form-check-label" for="exampleRadios1">
            Silver
            {currentPlan === "Silver" && " (Active)"}
          </label>
        </section>
        <ul>
          <li> 5 Post/day </li>
        </ul>
      </div>
      {/* ////////////////////////// */}
      <div className="border w-50 rounded membershipcard-gold">
        <section className="p-3 d-flex rounded gap-2">
          <input
            className="form-check-input"
            type="radio"
            name="exampleRadios"
            id="exampleRadios1"
            value="Gold"
            checked={selectedPlan === "Gold" || currentPlan === "Gold"}
            onChange={(e) => setSelectedPlan(e.target.value)}
          />
          <label className="form-check-label" for="exampleRadios1">
            Gold
            {currentPlan === "Gold" && " (Active)"}
          </label>
        </section>
        <ul>
          <li> Unlimited Posts </li>
        </ul>
      </div>

      <button type="submit" className="btn btn-primary">
        Pay
      </button>
    </form>
  );
}
