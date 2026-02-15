import Map "mo:core/Map";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Principal "mo:core/Principal";

module {
  type OldActor = {};

  public type UserProfile = {
    name : Text;
    email : Text;
    department : Text;
  };

  type AttMonth = {
    staffName : Text;
    monthYear : Text;
    absent : Nat;
    cl : Nat;
    el : Nat;
    sl : Nat;
    present : Nat;
    weekoff : Nat;
    totalDays : Nat;
    pf : Float;
    esi : Float;
    grossPay : Float;
    salaryAdvance : Float;
    basic : Float;
    da : Float;
    otherAllowances : Float;
  };

  type AttSalary = {
    earnablePay : Float;
    netPay : Float;
    monthlyGrossPay : Float;
    totalDays : Float;
    paidDays : Float;
  };

  type Staff = {
    name : Text;
    mobile : Text;
    designation : Text;
    basic : Float;
    da : Float;
    otherAllowance : Float;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    staffList : Map.Map<Text, Staff>;
    attMonths : Map.Map<Text, AttMonth>;
    finalizedSalaries : Map.Map<Text, AttSalary>;
  };

  public func run(_old : OldActor) : NewActor {
    {
      userProfiles = Map.empty<Principal, UserProfile>();
      staffList = Map.empty<Text, Staff>();
      attMonths = Map.empty<Text, AttMonth>();
      finalizedSalaries = Map.empty<Text, AttSalary>();
    };
  };
};
