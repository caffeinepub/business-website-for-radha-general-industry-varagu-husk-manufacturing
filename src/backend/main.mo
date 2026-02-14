actor {
  // Public method for canister liveness checks to ensure backend can be deployed and is running.
  public shared ({ caller }) func healthCheck() : async Text {
    "healthy";
  };
};
