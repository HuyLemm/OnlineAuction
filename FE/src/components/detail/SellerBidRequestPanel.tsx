interface Props {
  productId: string;
}

export function SellerBidRequestPanel({ productId }: Props) {
  // fetch bid requests by productId
  // show list: bidder name + rating + approve / reject

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
      <h3 className="text-foreground text-lg">
        Bid Requests
      </h3>

      {/* map requests here */}
      {/* Approve / Reject buttons */}
    </div>
  );
}
