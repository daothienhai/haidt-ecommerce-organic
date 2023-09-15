export async function addToCart(item) {
  try {
    const response = await fetch("http://localhost:8080/cart", {
      method: "POST",
      body: JSON.stringify(item),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchItemsByUserId(userId) {
  try {
    const response = await fetch("http://localhost:8080/cart?user=" + userId);
    const data = await response.json();
    return { data };
  } catch (error) {
    throw error;
  }
}

export async function updateCart(update) {
  try {
    const response = await fetch("http://localhost:8080/cart/" + update.id, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    return { data };
  } catch (error) {
    throw error;
  }
}

export async function deleteItemFromCart(itemId) {
  try {
    const response = await fetch("http://localhost:8080/cart/" + itemId, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    return { data: { id: itemId } };
  } catch (error) {
    throw error;
  }
}

export async function resetCart(userId) {
  try {
    const response = await fetchItemsByUserId(userId);
    const items = response.data;

    for (let item of items) {
      await deleteItemFromCart(item.id);
    }

    return { status: "success" };
  } catch (error) {
    throw error;
  }
}
