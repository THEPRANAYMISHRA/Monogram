import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase.init";

export default function Membership() {
  const baseurl = "https://monogram.onrender.com";
  // const baseurl = "http://localhost:4500";
  const key_sec = process.env.REACT_APP_RAZOR;
  const [user, isLoading] = useAuthState(auth);
  const [selectedPlan, setSelectedPlan] = useState();
  const [currentPlan, setCurrentPlan] = useState("Basic");

  // const handleNewMembership = async (e) => {
  //   e.preventDefault();
  //   if (!selectedPlan) return;
  //   try {
  //     const payload = {
  //       email: user.email,
  //       plan: selectedPlan,
  //     };
  //     let res = await axios.patch(`${baseurl}/user/order`, payload);
  //     console.log(res);
  //     return setCurrentPlan(res.data.user.membership);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
    const amount = 500;
    const currency = "INR";
    const receipt = "order_rcptid_11";

    if (!selectedPlan) return;
    try {
      const payload = {
        amount: amount,
        currency: currency,
        receipt: receipt,
      };
      let resOrder = await axios.post(`${baseurl}/user/order`, payload);
      ///////////////////

      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        console.log("Razorpay SDK failed to load. Are you online?");
        return;
      }

      const options = {
        key: key_sec || "rzp_test_e1P2mhZlev4Ix3",
        amount,
        currency,
        name: "Monogram",
        description: "Test Transaction",
        image: "https://cdn-icons-png.flaticon.com/128/2111/2111463.png",
        order_id: resOrder.data.id,
        handler: async function (response) {
          const body = {
            ...response,
          };
          let successRes = await axios.post(
            `${baseurl}/user/validate/payment`,
            body
          );
          console.log(successRes);
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      var rzp1 = new window.Razorpay(options);

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

  const handleFetchPlan = async () => {
    try {
      let res = await axios.post(`${baseurl}/user/details`, {
        email: user.email,
      });
      return setCurrentPlan(res.data.user.membership);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetchPlan();
  }, []);

  return (
    <form
      className="d-flex flex-column align-items-center justify-content-center gap-2 w-100 h-100"
      onSubmit={handleMakeOrder}
    >
      <p className="fs-1">Memberships</p>
      {/* ////////////////////////// */}
      <div className="border w-50 rounded">
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
            {currentPlan === "Basic" && " (Current)"}
          </label>
        </section>
        <ul>
          <li> 1 Post/day </li>
        </ul>
      </div>
      {/* ////////////////////////// */}
      <div className="border w-50 rounded">
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
            {currentPlan === "Silver" && " (Current)"}
          </label>
        </section>
        <ul>
          <li> 5 Post/day </li>
        </ul>
      </div>
      {/* ////////////////////////// */}
      <div className="border w-50 rounded">
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
            {currentPlan === "Gold" && " (Current)"}
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
