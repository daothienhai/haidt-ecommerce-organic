import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {} from "./orderSlice";

export default function Order() {
  const dispatch = useDispatch();

  return (
    <div>
      <div>
        <p>
          <p>
            Currently, there is no order information. Please proceed to make a
            purchase.
          </p>
        </p>
      </div>
    </div>
  );
}
