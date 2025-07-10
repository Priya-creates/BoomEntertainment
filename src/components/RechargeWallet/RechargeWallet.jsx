import React from "react";
import axios from "../../axiosInstance";
import { useUser } from "../../context/UserContext";
import "./style.css";

const RechargeWallet = () => {
  const { fetchDetails } = useUser();
  const [money, setMoney] = React.useState({ amount: "" });
  const [updatedBalance, setUpdatedBalance] = React.useState();
  const [rechargeAlert, setRechargeAlert] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showOverlay, setShowOverlay] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  function handleChange(e) {
    const { value } = e.target;
    setErrorMsg("");
    setMoney({ amount: value });

    if (Number(value) < 0) {
      setErrorMsg("Enter a valid amount greater than 0");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setShowOverlay(false);
    setRechargeAlert("");
    setUpdatedBalance(undefined);

    const amt = Number(money.amount);

    if (money.amount === "" || amt === 0) {
      setRechargeAlert("Enter valid amount for recharge");
      setShowOverlay(true);
      return;
    }

    if (amt < 0) {
      setErrorMsg("Enter a valid amount greater than 0");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/user/recharge-wallet",
        { amount: amt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRechargeAlert(res.data.message);
      setUpdatedBalance(Number(res.data.data));
      setShowOverlay(true);
      await fetchDetails();
    } catch (err) {
      setRechargeAlert(err.response?.data?.message || "Recharge failed");
      setUpdatedBalance(undefined);
      setShowOverlay(true);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setMoney({ amount: "" });
    setErrorMsg("");
  }

  function handleOverlayOk() {
    setShowOverlay(false);
    setMoney({ amount: "" });
    setRechargeAlert("");
    setUpdatedBalance(undefined);
  }

  return (
    <div className="recharge-wrapper">
      <div className="recharge-container">
        <h3 className="heading">Recharge your wallet</h3>

        <div className="element">
          <label htmlFor="amount">Enter recharge amount (in ₹):</label>
          <input
            type="number"
            name="amount"
            value={money.amount}
            onChange={handleChange}
            disabled={loading}
          />
          <p className="formError-box">{errorMsg}</p>
        </div>

        <div className="button-set">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="submit-btn"
          >
            {loading ? "Recharging..." : "Recharge"}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </div>

      {showOverlay && (
        <div className="message-overlay">
          <div className="message-box">
            <div className={`alert ${updatedBalance !== undefined ? "success" : "error"}`}>
              <p>{rechargeAlert}</p>
              {updatedBalance !== undefined && (
                <p style={{ fontWeight: "700" }}>Updated Balance: ₹{updatedBalance}</p>
              )}
            </div>
            <button className="ok-btn" onClick={handleOverlayOk}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RechargeWallet;
